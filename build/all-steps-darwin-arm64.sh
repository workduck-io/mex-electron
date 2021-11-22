#! /usr/bin/env bash

./node_modules/.bin/electron-rebuild --force --arch=arm64
yarn package --arch=arm64


node build/darwin-sign.js arm64
node build/darwin-notarize.js arm64
node build/darwin-build-dmg.js arm64
node build/darwin-build-zip.js arm64
