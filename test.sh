#!/bin/bash
./build.sh
mkdir -p /tmp/kizz-install
tar -xf "dist/kizz-linux-x64.tar.gz" -C "/tmp/"
cd /tmp/kizz-linux-x64
sudo ./script/install.sh
