export $(cat .env | xargs)

OUT_PATH=./out

mkdir -p $OUT_PATH

lighthouse $URL --view --output-path=$OUT_PATH/report.html --emulated-form-factor=desktop
