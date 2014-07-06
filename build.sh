#!/bin/bash

function pkg {
    build=$1
    echo "Building $build"
    dir="/tmp/kizz-$build"
    rm -rf $dir
    mkdir -p "$dir/bin"
    mkdir -p "$dir/script"
    cp -r example $dir
    cp -r lib $dir
    cp -r "bin/node-v0.11.13-$build" "$dir/bin"
    if [ "$1" == "windows" ]; then
        cp script/*.bat "$dir/script"
    else
        cp script/*.sh "$dir/script"
    fi
    tar -zcf "dist/kizz-$build".tar.gz --directory=/tmp/ "kizz-$build"
}

mkdir -p ./dist
pkg "linux-x64"
pkg "linux-x86"
pkg "darwin-x64"
pkg "darwin-x86"
pkg "windows"
