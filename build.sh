#!/bin/bash

export eTAG="latest-dev"
echo $1
if [ $1 ] ; then
  eTAG=$1
fi

echo Building qolzam/vang-ws:$eTAG

docker build -t qolzam/vang-ws:$eTAG .

echo Push qolzam/vang-ws:$eTAG

docker push qolzam/vang-ws:$eTAG   