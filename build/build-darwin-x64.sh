#! /usr/bin/env bash

APPLE_ID="tech@workduck.io" APPLE_ID_PASSWORD="team-apple-id-password" yarn package --arch=x64

codesign --deep --force --sign "Developer ID Application: Workduck Private Limited (9TGRGUPH6C)" --arch x86_64 out/Mex-darwin-x64/Mex.app

node build/installer-dmg.js x64
