import os
import re
import random
import json
from math_verify import parse, verify, LatexExtractionConfig


def extract_solution(solution_str, method='strict'):
    assert method in ['strict', 'flexible']

    if method == 'strict':
        pattern = r"<ANSWER>(.*)</ANSWER>"
        solution = re.search(pattern, solution_str, re.DOTALL)

        if solution is None:
            final_answer = None
        else:
            final_answer = solution.group(1).strip()
    elif method == 'flexible':
        raise NotImplementedError
    return final_answer


def get_type(solution_str):
    if "Assistant:<COT>" in solution_str:
        return "COT"
    elif "Assistant:<CODE>" in solution_str:
        return "CODE"
    elif "Assistant:<LONG_COT>" in solution_str:
        return "LONG_COT"
    elif "Assistant:<ANSWER>" in solution_str:
        return "DIRECT"
    else:
        return "UNKNOWN"


def compute_score(solution_str, ground_truth, output_file, method='strict', format_score=0., score=1.):
    answer = extract_solution(solution_str=solution_str, method=method)

    actual_score = 0

    do_print = random.randint(1, 512) == 1
    if do_print:
        print("--------------------")
        print(f"solution_str: {solution_str}")
        print(f"answer: {answer}, ground_truth: {ground_truth}")
        print("--------------------")

    if answer is None:
        if do_print:
            print("Invalid answer")
        actual_score = 0
    else:
        parsed_gt = parse(ground_truth, extraction_config=[LatexExtractionConfig()])
        parsed_output = parse(answer)
        if verify(parsed_gt, parsed_output):
            if do_print:
                print("Correct answer")
            actual_score = score
        else:
            if do_print:
                print("Incorrect answer")
            actual_score = format_score

    # format
    if not any(tag in solution_str for tag in ("Assistant:<CODE>", "Assistant:<COT>", "Assistant:<ANSWER>", "Assistant:<LONG_COT>")):
        if do_print:
            print("Invalid format")
        actual_score = 0.
    else:
        invalid_combinations = {
            "Assistant:<CODE>": {"<COT>", "<LONG_COT>", "</COT>", "</LONG_COT>"},
            "Assistant:<COT>": {"<CODE>", "<LONG_COT>", "</CODE>", "</LONG_COT>"},
            "Assistant:<LONG_COT>": {"<CODE>", "<COT>", "</CODE>", "</COT>"},
            "Assistant:<ANSWER>": {"<CODE>", "<COT>", "<LONG_COT>", "</CODE>", "</COT>", "</LONG_COT>"},
        }

        for key, invalid_tags in invalid_combinations.items():
            if key in solution_str and any(tag in solution_str for tag in invalid_tags):
                if do_print:
                    print("Invalid format")
                actual_score = 0.
                break
    # format

    _type = get_type(solution_str)

    if do_print:
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, "a") as f:
            output = json.dumps({"solution_str": solution_str, "answer": answer, "ground_truth": ground_truth, "actual_score": actual_score})
            f.write(output + "\n")

    output_original = output_file.replace(".jsonl", "_original.jsonl")
    os.makedirs(os.path.dirname(output_original), exist_ok=True)
    with open(output_original, "a") as f:
        output = json.dumps({"t": _type, "s": actual_score})
        f.write(output + "\n")

    return actual_score


def compute_score_test(solution_str, ground_truth, method='pass', format_score=0., score=1.):
    if method == 'pass':
        answer = extract_solution(solution_str=solution_str, method=method)
        actual_score = 0
        if answer is None:
            actual_score = 0
        else:
            parsed_gt = parse(ground_truth, extraction_config=[LatexExtractionConfig()])
            parsed_output = parse(answer)
            if verify(parsed_gt, parsed_output):
                actual_score = score
            else:
                actual_score = format_score
    elif method == 'sc':
        parsed_gt = parse(ground_truth, extraction_config=[LatexExtractionConfig()])
        parsed_output = parse(solution_str)
        if verify(parsed_gt, parsed_output):
            actual_score = score
        else:
            actual_score = format_score
    else:
        raise NotImplementedError
    return actual_score
