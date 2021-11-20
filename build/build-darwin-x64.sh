#! /usr/bin/env bash

yarn package --arch=x64

node build/darwin-sign.js x64
node build/darwin-notarize.js x64
node build/darwin-build-dmg.js x64
