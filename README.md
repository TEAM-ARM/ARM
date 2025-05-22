# ARM: Adaptive Reasoning Model

This repository contains the codebase for training our model using LLaMA-Factory (SFT) and VeRL (RL).

## Environments

We use two separate conda environments for each training stage:

### Stage1: SFT

```bash
conda env create -f environment/llama_factory_env.yaml
conda activate arm_llama_factory
cd LLaMA-Factory
# train
CUDA_VISIBLE_DEVICES=0,1,2,3 llamafactory-cli train stage1_scripts/qwen2.5_7b/train.yaml
# merge
llamafactory-cli export stage1_scripts/qwen2.5_7b/merge.yaml
```

### Stage1: RL
```bash
conda env create -f environment/verl_env.yaml
conda activate arm_verl
conda remove pytorch
pip3 install torch==2.4.0 --index-url https://download.pytorch.org/whl/cu124
pip3 install pyyaml
pip3 install flash-attn --no-build-isolation
cd verl
# train
bash stage2_scripts/trainer/run.sh
# generate
bash stage2_scripts/generation/run.sh
# evaluate
bash stage2_scripts/evaluation/run.sh
```