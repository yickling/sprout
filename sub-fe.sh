#!/bin/bash

trap ctrl_c INT

function ctrl_c() {
    echo "** Trapped CTRL-C"
    cd ..
    exit
}

cd $(PWD)/fe
PORT=3001 npm start
cd ..