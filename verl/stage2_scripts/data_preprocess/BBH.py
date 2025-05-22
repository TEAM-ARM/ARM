"""
Preprocess the BBH dataset to parquet format
"""

import re
import os
import datasets
import utils
from verl.utils.hdfs_io import copy, makedirs
import argparse

if __name__ == '__main__':
    origin_data = '../../data/jsonl/BBH'
    local_dir = '../../data/parquet/BBH'
    hdfs_dir = None

    for _file in os.listdir(origin_data):
        if not _file.endswith('.jsonl'):
            raise ValueError(f"File {_file} is not a jsonl file")
        file_name = _file.split('.')[0]
        dataset = datasets.load_dataset(
            'json',
            data_files={
                'test': f"{origin_data}/{_file}"
            }
        )
        test_dataset = dataset['test']

        def make_map_fn(split):
            def process_fn(example, idx):
                question = example['question']
                answer = example.pop('answer')
                data = {
                    "data_source": f'my_data/{file_name}',
                    "prompt": [{
                        "role": "user",
                        "content": question,
                    }],
                    "ability": "symbolic",
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

        test_dataset = test_dataset.map(function=make_map_fn('test'), with_indices=True)
        test_dataset.to_parquet(os.path.join(local_dir, f'{file_name}.parquet'))
