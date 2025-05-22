"""
Preprocess the csqa dataset to parquet format
"""

import re
import os
import datasets
import utils
from verl.utils.hdfs_io import copy, makedirs
import argparse


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--origin_data', default='../../data/jsonl/csqa')
    parser.add_argument('--local_dir', default='../../data/parquet')
    parser.add_argument('--hdfs_dir', default=None)

    args = parser.parse_args()

    dataset = datasets.load_dataset(
        'json',
        data_files={
            'train': f"{args.origin_data}/csqa_train.jsonl",
            'test': f"{args.origin_data}/csqa_test.jsonl"
        }
    )

    train_dataset = dataset['train']
    test_dataset = dataset['test']

    # add a row to each data item that represents a unique id
    def make_map_fn(split):
        def process_fn(example, idx):
            question = example.pop('question')
            answer = example.pop('answer')
            data = {
                "data_source": 'my_data/csqa',
                "prompt": [{
                    "role": "user",
                    "content": question,
                }],
                "ability": "commonsense",
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

    train_dataset = train_dataset.map(function=make_map_fn('train'), with_indices=True)
    test_dataset = test_dataset.map(function=make_map_fn('test'), with_indices=True)


    local_dir = args.local_dir
    hdfs_dir = args.hdfs_dir

    train_dataset.to_parquet(os.path.join(local_dir, 'csqa_train.parquet'))
    test_dataset.to_parquet(os.path.join(local_dir, 'csqa_test.parquet'))

    if hdfs_dir is not None:
        makedirs(hdfs_dir)
        copy(src=local_dir, dst=hdfs_dir)
