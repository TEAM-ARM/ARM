# ARM: Adaptive Reasoning Model
ARM—Adaptive Reasoning Model, a reasoning model capable of adaptively selecting appropriate reasoning formats based on the task at hand.

<p align="center">
<img src="images/000_ARM.jpg" alt="ARM" style="width: 90%;">
</p>

## Environments
This repository contains the codebase for training and evaluating using [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory) (SFT) and [VeRL](https://github.com/volcengine/verl) (RL).
We use two separate conda environments for each training stage:
```bash
# SFT
conda env create -f environment/llama_factory_env.yaml
conda activate arm_llama_factory

# RL
conda env create -f environment/verl_env.yaml
conda activate arm_verl
conda remove pytorch
pip3 install torch==2.4.0 --index-url https://download.pytorch.org/whl/cu124
pip3 install pyyaml
pip3 install flash-attn --no-build-isolation
````


## Stage1: SFT
```bash
conda activate arm_llama_factory
cd LLaMA-Factory
```
### Train
```bash
CUDA_VISIBLE_DEVICES=0,1,2,3 llamafactory-cli train stage1_scripts/qwen2.5_7b/train.yaml
```
### Merge
```bash
llamafactory-cli export stage1_scripts/qwen2.5_7b/merge.yaml
```


## Stage2: RL
```bash
conda activate arm_verl
cd verl
```
### Train
```bash
bash stage2_scripts/trainer/run.sh
```

### Generate
```bash
bash stage2_scripts/generation/run.sh
```

### Evaluate
```bash
bash stage2_scripts/evaluation/run.sh
```