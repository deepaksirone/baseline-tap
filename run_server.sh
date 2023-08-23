#! /usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

id=$1

fname=./applets/applet_$id.json.ts
echo $fname
sed -i -E "s|^(const rule_fn = require)\('(.+)'\);|\1('$fname');|" server.js
sudo /home/riscv/nodejs/node-v14.8.0-linux-riscv64/bin/node server.js > tap_baseline_${id}.log
