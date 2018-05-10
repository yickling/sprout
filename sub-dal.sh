#!/bin/bash

trap ctrl_c INT

function ctrl_c() {
    echo "** Trapped CTRL-C"
    cd ..
    exit
}

cd $(PWD)/dal
sls offline start
cd ..