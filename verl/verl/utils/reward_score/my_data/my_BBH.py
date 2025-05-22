import os
import re
import random
import json
from math_verify import parse, verify

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


def compute_score_test(solution_str, ground_truth, method='pass', format_score=0., score=1.):
    if method == 'pass':
        answer = extract_solution(solution_str=solution_str, method=method)
        if answer is None:
            actual_score = 0
        else:
            parsed_gt = parse(ground_truth)
            parsed_output = parse(answer)
            if verify(parsed_gt, parsed_output):
                actual_score = score
            else:
                actual_score = format_score
    elif method == 'sc':
        if solution_str == ground_truth:
            actual_score = score
        else:
            actual_score = format_score
    else:
        raise NotImplementedError
    return actual_score
