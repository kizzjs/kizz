#!/bin/bash
/usr/local/lib/kizz/bin/node-v0.11.13/bin/node
type nodejs > /dev/null 2>&1 || echo >&2 "Nodejs not installed"
uname -a
