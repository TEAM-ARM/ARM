export OUTPUT_RESPONSE_PATH=/output
export TOKENNIZER_PATH=/path/to/model
export CONS=8
export TEMP=0.7
export N_SAMPLES=8

python3 -m verl.trainer.main_eval_list \
    data.path=$OUTPUT_RESPONSE_PATH \
    data.tokenizer_path=$TOKENNIZER_PATH \
    data.prompt_key=prompt \
    data.response_key=responses \
    data.cons=$CONS \
    data.temp=$TEMP \
    data.samples=$N_SAMPLES
