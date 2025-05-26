# Copyright 2024 Bytedance Ltd. and/or its affiliates
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""
Offline evaluate the performance of a generated file using reward model and ground truth verifier.
The input is a parquet file that contains N generated sequences and (optional) the ground truth.
"""
import re
import hydra
import os
from verl.utils.fs import copy_local_path_from_hdfs
import pandas as pd
import numpy as np
from verl.utils.reward_score.my_data import my_gsm8k, my_csqa, my_MATH, my_openbookqa, my_SVAMP, my_BBH, my_AIME2025
from math_verify import parse, verify, LatexExtractionConfig
from collections import Counter, defaultdict
from tqdm import tqdm
import transformers
import random

token_dict = {
    "direct": "<ANSWER>\n",
    "long_cot": "<LONG_COT>\n",
    "cot": "<COT>\n",
    "code": "<CODE>\n",
}

def find_instruct(_file):
    if 'code' in _file:
        return "<CODE>\n"
    elif 'long_cot' in _file:
        return "<LONG_COT>\n"
    elif 'cot' in _file:
        return "<COT>\n"
    elif 'direct' in _file:
        return "<ANSWER>\n"
    else:
        return ""

def extract_solution(solution_str):
    pattern = r"<ANSWER>(.*)</ANSWER>"
    solution = re.search(pattern, solution_str, re.DOTALL)
    if solution is None:
        final_answer1 = None
    else:
        final_answer1 = solution.group(1).strip()
    return final_answer1


def get_type(solution_str):
    if "<COT>" in solution_str:
        return "COT"
    elif "<CODE>" in solution_str:
        return "CODE"
    elif "<LONG_COT>" in solution_str:
        return "LONG_COT"
    else:
        return "DIRECT"


def select_reward_fn(data_source):
    if data_source == 'my_data/gsm8k':
        return my_gsm8k.compute_score_test
    elif data_source == 'my_data/csqa':
        return my_csqa.compute_score_test
    elif data_source == 'my_data/MATH':
        return my_MATH.compute_score_test
    elif data_source == 'my_data/openbookqa':
        return my_openbookqa.compute_score_test
    elif data_source == 'my_data/SVAMP':
        return my_SVAMP.compute_score_test
    elif 'BBH' in data_source:
        return my_BBH.compute_score_test
    elif data_source == 'my_data/AIME2025':
        return my_AIME2025.compute_score_test
    else:
        raise NotImplementedError


def find_most_common(answer_span_list, data_source):
    if data_source in ['my_data/gsm8k', 'my_data/MATH', 'my_data/SVAMP', 'my_data/AIME2025', 'my_data/BBH_object_counting_test']:
        parsed_list = [parse(answer_span) for answer_span in answer_span_list]
        ret_idx = 0
        max_common_num = 0
        for i, parsed_answer_span in enumerate(parsed_list):
            common_num = 0
            for j, parsed_answer_span_2 in enumerate(parsed_list):
                if i != j and verify(parsed_answer_span, parsed_answer_span_2):
                    common_num += 1
            if common_num > max_common_num:
                max_common_num = common_num
                ret_idx = i
        return answer_span_list[ret_idx]
    elif data_source in ['my_data/csqa', 'my_data/openbookqa']:
        answer_span_list = [answer_span.replace(r'(', '').replace(r')', '') for answer_span in answer_span_list]
        most_common_answer = Counter(answer_span_list).most_common(1)[0][0]
        return most_common_answer
    elif 'BBH' in data_source:
        if data_source in ['my_data/BBH_dyck_languages_test', 'my_data/BBH_word_sorting_test']:
            return Counter(answer_span_list).most_common(1)[0][0]
        answer_span_list = [answer_span.replace(r'\boxed{', '').replace(r'}', '') for answer_span in answer_span_list]
        answer_span_list = [answer_span.replace(r'\text{', '') for answer_span in answer_span_list]
        answer_span_list = [answer_span.replace(r'(', '').replace(r')', '') for answer_span in answer_span_list]
        answer_span_list = [answer_span.replace('\\', '') for answer_span in answer_span_list]
        if data_source in ['my_data/BBH_boolean_expressions_test', 'my_data/BBH_navigate_test',
                           'my_data/BBH_causal_judgement_test', 'my_data/BBH_formal_fallacies_test',
                           'my_data/BBH_web_of_lies_test', 'my_data/BBH_sports_understanding_test']:
            answer_span_list = [answer_span.replace('0', 'False') for answer_span in answer_span_list]
            answer_span_list = [answer_span.replace('1', 'True') for answer_span in answer_span_list]
            answer_span_list = [answer_span.lower() for answer_span in answer_span_list]
        if data_source in ['my_data/BBH_boolean_expressions_test', 'my_data/BBH_navigate_test',
                           'my_data/BBH_causal_judgement_test', 'my_data/BBH_web_of_lies_test']:
            answer_span_list = [answer_span[0].upper() + answer_span[1:] if len(answer_span) > 0 else answer_span for answer_span in answer_span_list]
        most_common_answer = Counter(answer_span_list).most_common(1)[0][0]
        return most_common_answer

    else:
        most_common_answer = Counter(answer_span_list).most_common(1)[0][0]
        return most_common_answer


@hydra.main(config_path='config', config_name='evaluation', version_base=None)
def main(config):
    tokenizer_path = config.data.tokenizer_path
    tokenizer = transformers.AutoTokenizer.from_pretrained(
        tokenizer_path, trust_remote_code=True
    )

    bbh_total, bbh_passes, bbh_num = 0, 0, 0
    bbh_total_token_count, bbh_total_num_of_responses = 0, 0
    bbh_type_format_dict = defaultdict(list)

    print(f"config.data.cons: {config.data.cons}")
    print(f"config.data.path: {config.data.path}")
    print(f'-------------------')
    for _file in os.listdir(config.data.path):
        if not (_file.endswith('.parquet')) or (not str(config.data.temp) in _file) or (not '_'+str(config.data.samples) in _file):
            continue

        print(f'Processing {_file}')
        total_token_count = 0
        num_of_response = 0
        type_format_dict = defaultdict(list)

        local_path = copy_local_path_from_hdfs(os.path.join(config.data.path, _file))

        dataset = pd.read_parquet(local_path)
        prompts = dataset[config.data.prompt_key]
        responses = dataset[config.data.response_key]
        data_sources = dataset[config.data.data_source_key]

        reward_model_data = dataset[config.data.reward_model_key]
        passes = 0
        total = len(dataset)
        print(data_sources[0])

        for i in tqdm(range(total)):
            response_lst_full = responses[i]
            raw_response_lst_full = []
            for r in response_lst_full:
                prefix = find_instruct(_file)
                r = prefix + r
                raw_response_lst_full.append(r)
            k = min(config.data.cons, len(raw_response_lst_full))
            response_lst = random.sample(raw_response_lst_full, k)

            data_source = data_sources[i]
            # select reward score based on data_source
            prompt = prompts[i]
            reward_data = reward_model_data[i]
            reward_fn = select_reward_fn(data_source)
            ground_truth = reward_data['ground_truth']

            score_lst = []
            answer_span_list = []
            for r in response_lst:
                _type = get_type(r)
                type_format_dict[_type].append(r)
                num_of_response += 1

                output = extract_solution(r)
                tokenized_response = tokenizer(r)
                total_token_count += len(tokenized_response['input_ids'])

                if output is None:
                    if 'AIME2025' in _file or 'MATH' in _file:
                        output = '\n'.join(r.strip().split('\n')[-5:])
                    else:
                        continue
                answer_span_list.append(output)
            if len(answer_span_list) == 0:
                continue

            sc_answer = find_most_common(answer_span_list, data_source)
            score = reward_fn(sc_answer, ground_truth, method='sc')
            score_lst.append(score)
            max_score = np.max(score_lst)

            if max_score == 1:
                passes += 1


        for key, value in type_format_dict.items():
            print(f"{key}: {len(value)}")
            print("percentage: {:.1f}%".format(len(value) / num_of_response * 100))
        print('-------------------')
        print("average_token_count: {:.1f}".format(total_token_count / num_of_response))
        print('acc: {:.1f}%'.format(passes / total * 100))
        print('-------------------\n\n')

        if 'BBH' in data_sources[0]:
            bbh_total += total
            bbh_passes += passes
            bbh_total_token_count += total_token_count
            bbh_total_num_of_responses += num_of_response
            for key, value in type_format_dict.items():
                bbh_type_format_dict[key] += value
            bbh_num += 1


    print(f'bbh_total: {bbh_total}')
    print(f'bbh_passes: {bbh_passes}')
    if bbh_total == 0:
        bbh_total = 1
        bbh_total_num_of_responses = 1
    print('bbh_average_token_count: {:.1f}'.format(bbh_total_token_count / bbh_total_num_of_responses))
    print('bbh_acc: {:.1f}%'.format(bbh_passes / bbh_total * 100))
    for key, value in bbh_type_format_dict.items():
        print(f"{key}: {len(value)}")
        print("percentage: {:.1f}%".format(len(value) / bbh_total_num_of_responses * 100))
    print('-------------------')


if __name__ == '__main__':
    main()
