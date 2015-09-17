#!/bin/bash

for x in chunks/* 
do
    echo $x
    tail -n +2 $x > ${x}.csv
done