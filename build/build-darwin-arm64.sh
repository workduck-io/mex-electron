#! /usr/bin/env bash

yarn package --arch=arm64

codesign --deep --force --sign "Developer ID Application: Workduck Private Limited (9TGRGUPH6C)" --arch arm64 out/Mex-darwin-arm64/Mex.app

node build/darwin-notarize.js arm64
node build/darwin-build-dmg.js arm64
