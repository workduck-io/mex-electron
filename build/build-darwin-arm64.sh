#! /usr/bin/env bash

APPLE_ID="tech@workduck.io" APPLE_ID_PASSWORD="ivaw-ymed-sglx-pxas" yarn package --arch=arm64

codesign --deep --force --sign "Developer ID Application: Workduck Private Limited (9TGRGUPH6C)" --arch arm64 out/Mex-darwin-arm64/Mex.app

node build/installer-dmg.js arm64
