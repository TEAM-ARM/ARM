import re
import json


def read_json_file(filepath):
    data = []
    if filepath.endswith('.json'):
        with open(filepath, 'r') as file:
            data = json.load(file)
    elif filepath.endswith('.jsonl'):
        with open(filepath, 'r') as file:
            for line in file:
                data.append(json.loads(line))
    else:
        raise ValueError("Unsupported file format. Please provide a .json or .jsonl file.")
    return data


def save_file(data, path):
    with open(path, 'w', encoding='utf-8') as w:
        for unit in data:
            output = json.dumps(unit)
            w.write(output + "\n")
        w.close()


def get_batch_res_dict(result_file):
    batch_res_dict = {}
    data = read_json_file(result_file)
    total_prompt_tokens, total_completion_tokens = 0, 0
    for idx, unit in enumerate(data):
        prompt_tokens = unit['response']['body']['usage']['prompt_tokens']
        completion_tokens = unit['response']['body']['usage']['completion_tokens']
        total_prompt_tokens += prompt_tokens
        total_completion_tokens += completion_tokens
        if unit['error'] is not None and unit['response']['status_code'] != 200:
            raise ValueError(f"error: {unit['error']}")
        batch_res_dict[unit['custom_id']] = unit
    assert len(data) == len(batch_res_dict)
    total_price = cal_price(data[0]['response']['body']['model'], total_prompt_tokens, total_completion_tokens)
    print(total_price)
    return batch_res_dict


if __name__ == '__main__':
    pass