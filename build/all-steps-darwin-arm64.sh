#! /usr/bin/env bash

cp src/Defaults/dev_.ts build/dev_.ts
cp build/prod-dev_.ts src/Defaults/dev_.ts

./node_modules/.bin/electron-rebuild --force --arch=arm64
yarn package --arch=arm64


node build/darwin-sign.js arm64
node build/darwin-notarize.js arm64
node build/darwin-build-dmg.js arm64
node build/darwin-build-zip.js arm64

cp build/dev_.ts src/Defaults/dev_.ts
