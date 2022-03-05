#! /usr/bin/env bash

./node_modules/.bin/electron-rebuild --force --arch=x64 --force-abi=101
yarn package --arch=x64

node build/darwin-sign.js x64
node build/darwin-notarize.js x64
node build/darwin-build-dmg.js x64
node build/darwin-build-zip.js x64
