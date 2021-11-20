#! /usr/bin/env bash

yarn package --arch=x64

codesign \
    --deep \
    --force \
    --sign "Developer ID Application: Workduck Private Limited (9TGRGUPH6C)" \
    --arch x86_64 \
    --entitlements build/entitlements.plist
    --options runtime,library
    out/Mex-darwin-x64/Mex.app

node build/darwin-sign x64
node build/darwin-notarize.js x64
node build/darwin-build-dmg.js x64
