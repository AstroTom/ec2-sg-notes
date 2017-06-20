#!/bin/bash

VERSION=`node -p "require('./manifest.json').version"`;
TIMESTAMP=`date -u +"%Y-%m-%d-at-%H-%M"`;

zip -r build/$VERSION-$TIMESTAMP.zip . -x '\.*' -x '*/\.*' -x 'build/*'
