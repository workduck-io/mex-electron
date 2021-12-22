#! /usr/bin/env bash

cp src/Defaults/dev_.ts build/dev_.ts
cp build/prod-dev_.ts src/Defaults/dev_.ts

./node_modules/.bin/electron-rebuild --force --arch=x64
yarn package --arch=x64

node build/darwin-sign.js x64
node build/darwin-notarize.js x64
node build/darwin-build-dmg.js x64
node build/darwin-build-zip.js x64

cp build/dev_.ts src/Defaults/dev_.ts
