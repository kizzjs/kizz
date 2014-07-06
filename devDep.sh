mkdir -p bin
cd bin
curl http://nodejs.org/dist/v0.11.13/SHASUMS.txt
aria2c http://nodejs.org/dist/v0.11.13/node-v0.11.13-darwin-x64.tar.gz
aria2c http://nodejs.org/dist/v0.11.13/node-v0.11.13-darwin-x86.tar.gz
aria2c http://nodejs.org/dist/v0.11.13/node-v0.11.13-linux-x64.tar.gz
aria2c http://nodejs.org/dist/v0.11.13/node-v0.11.13-linux-x86.tar.gz
aria2c http://nodejs.org/dist/v0.11.13/node.exe
shasum *
for i in *.tar.gz; do tar -xvf $i; done
rm *.tar.gz
mkdir node-v0.11.13-windows
mv node.exe node-v0.11.13-windows
