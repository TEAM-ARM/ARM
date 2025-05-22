"""
Preprocess the AIME2025 dataset to parquet format
"""

import re
import os
import datasets
import utils
from verl.utils.hdfs_io import copy, makedirs
import argparse


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--origin_data', default='../../data/jsonl/AIME2025')
    parser.add_argument('--local_dir', default='../../data/parquet')
    parser.add_argument('--hdfs_dir', default=None)

    args = parser.parse_args()

    dataset = datasets.load_dataset(
        'json',
        data_files={
            'test': f"{args.origin_data}/AIME2025_test.jsonl"
        }
    )

    test_dataset = dataset['test']

    # add a row to each data item that represents a unique id
    def make_map_fn(split):
        def process_fn(example, idx):
            question = example['question']
            answer = example.pop('answer')
            data = {
                "data_source": 'my_data/AIME2025',
                "prompt": [{
                    "role": "user",
                    "content": question,
                }],
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

    test_dataset = test_dataset.map(function=make_map_fn('test'), with_indices=True)

    local_dir = args.local_dir
    hdfs_dir = args.hdfs_dir

    test_dataset.to_parquet(os.path.join(local_dir, 'AIME2025_test.parquet'))

    if hdfs_dir is not None:
        makedirs(hdfs_dir)
        copy(src=local_dir, dst=hdfs_dir)
