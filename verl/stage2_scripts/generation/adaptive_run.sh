export CUDA_VISIBLE_DEVICES=0,1,2,3
export N_GPUS=4
export TP_SIZE=4
export DATA_DIR=/path/to/ARM/verl/data/parquet
export MODEL_PATH=/path/to/model
export OUTPUT_RESPONSE_PATH=/output
export TEMP=0.7
export N_SAMPLES=8
export VLLM_ATTENTION_BACKEND=XFORMERS

gsm8k_test_path=$DATA_DIR/gsm8k_test.parquet
csqa_test_path=$DATA_DIR/csqa_test.parquet

test_files="['$gsm8k_test_path', '$csqa_test_path']"

python3 -u -m verl.trainer.main_generation_list \
    trainer.nnodes=1 \
    trainer.n_gpus_per_node=$N_GPUS \
    data.batch_size=1408 \
    data.path="$test_files" \
    data.prompt_key=prompt \
    data.n_samples=$N_SAMPLES \
    data.output_path=$OUTPUT_RESPONSE_PATH \
    data.continue_final_message=False\
    data.add_generation_prompt=True\
    model.path=$MODEL_PATH \
    +model.trust_remote_code=True \
    rollout.temperature=$TEMP \
    rollout.top_k=-1 \
    rollout.top_p=1.0 \
    rollout.prompt_length=2048 \
    rollout.response_length=4096 \
    rollout.tensor_model_parallel_size=$TP_SIZE \
    rollout.gpu_memory_utilization=0.8
