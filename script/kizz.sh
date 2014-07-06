#!/bin/bash
node_version=v0.11.13
os=`uname -o`
if [[ $os == *Linux* ]]
then
    os=linux
else
    if [[ $os == *Darwin* ]]
    then
        os=darwin
    fi
fi
arch=`uname -m`
if [[ $arch == *x86_64* ]]
then
    arch=x64
else
    arch=x86
fi
build="$os-$arch"

node="/usr/local/lib/kizz/bin/node-$node_version-$build/bin/node"
echo "KIZZ (Node `$node -v`)"
