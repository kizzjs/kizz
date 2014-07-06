#!/bin/bash

function pkg {
    build=$1
    echo "Building $build"
    dir="/tmp/kizz-$build"
    rm -rf $dir
    mkdir -p "$dir/bin"
    cp -r example $dir
    cp -r lib $dir
    if [ "$1" == "windows" ]; then
        cp script/*.bat $dir
        cp -r bin/node-v0.11.13-windows "$dir/bin/node"
    else
        cp script/*.sh $dir
        tar -xf "bin/node-v0.11.13-$build.tar.gz" -C "$dir/bin"
        mv "$dir/bin/node-v0.11.13-$build" "$dir/bin/node"
    fi
    tar -zcf "dist/kizz-$build".tar.gz --directory=/tmp/ "kizz-$build"
}

mkdir -p ./dist
pkg "linux-x64"
pkg "linux-x86"
pkg "darwin-x64"
pkg "darwin-x86"
pkg "windows"
