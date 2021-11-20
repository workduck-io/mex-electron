#! /usr/bin/env bash

yarn package --arch=arm64


node build/darwin-sign.js arm64
node build/darwin-notarize.js arm64
node build/darwin-build-dmg.js arm64
