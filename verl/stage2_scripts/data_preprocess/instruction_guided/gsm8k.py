"""
Preprocess the gsm8k dataset to parquet format
"""

import re
import os
import datasets
import utils
from verl.utils.hdfs_io import copy, makedirs
import argparse

token_dict = {
    "inst_direct": "<ANSWER>\n",
    "inst_cot": "<COT>\n",
    "inst_code": "<CODE>\n",
    "inst_long_cot": "<LONG_COT>\n",
}

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--origin_data', default='../../../data/jsonl/gsm8k')
    parser.add_argument('--local_dir', default='../../../data/parquet/instruction_guided')
    parser.add_argument('--hdfs_dir', default=None)

    args = parser.parse_args()

    dataset = datasets.load_dataset(
        'json',
        data_files={
            'test': f"{args.origin_data}/gsm8k_test.jsonl"
        }
    )


    # add a row to each data item that represents a unique id
    def make_map_fn(split, first_token):
        def process_fn(example, idx):
            question = example['question']
            answer = example.pop('answer')
            prompt = [{
                "role": "user",
                "content": question,
            }, {
                "role": "assistant",
                "content": first_token,
            }]

            data = {
                "data_source": 'my_data/gsm8k',
                "prompt": prompt,
                "ability": "math",
                "reward_model": {
                    "style": "rule",
                    "ground_truth": answer
                },
                "extra_info": {
                    'split': split,
                    'index': idx,
                    'answer': answer,
                    "question": question,
                }
            }
            return data

        return process_fn

    for inst_mode in token_dict:
        test_dataset = dataset['test']
        test_dataset = test_dataset.map(function=make_map_fn('test', token_dict[inst_mode]), with_indices=True)

        local_dir = args.local_dir
        hdfs_dir = args.hdfs_dir

        test_dataset.to_parquet(os.path.join(local_dir, f'{inst_mode}_gsm8k_test.parquet'))

        if hdfs_dir is not None:
            makedirs(hdfs_dir)
            copy(src=local_dir, dst=hdfs_dir)
