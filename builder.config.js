/* eslint-disable @typescript-eslint/no-var-requires */

const { version, productName } = require('./package.json')
const semver = require('semver')
const { Configuration } = require('electron-builder')

const checkAlpha = (version) => {
  const parsed = semver.parse(version)
  if (parsed.prerelease[0] === 'alpha') return true

  return false
}
const isAlpha = checkAlpha(version)

const appBundleId = isAlpha ? 'com.workduck.mex-alpha' : 'com.workduck.mex'

/** @type {import('electron-builder').Configuration} */
const configuration = {
  publish: [
    {
      provider: 'generic',
      url: 'http://localhost:9000/'
    }
  ],
  protocols: {
    name: 'mex',
    schemes: ['mex']
  },
  directories: {
    output: 'out',
    buildResources: 'assets'
  },
  compression: 'store',
  files: ['dist/**'],
  appId: appBundleId,
  afterSign: 'electron-builder-notarize',
  buildDependenciesFromSource: true,
  mac: {
    artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
    category: 'public.app-category.productivity',
    gatekeeperAssess: false,
    entitlements: 'scripts/entitlements.plist',
    entitlementsInherit: 'scripts/entitlements.plist',
    hardenedRuntime: true,
    extendInfo: {
      NSAppleEventsUsageDescription: 'Mex can control other applications with AppleScript.'
    },
    target: [
      {
        target: 'zip',
        arch: ['x64']
      },
      {
        target: 'dmg',
        arch: ['x64']
      }
    ]
  },
  dmg: {
    artifactName: '${productName}-${version}-${os}-${arch}.${ext}',
    title: productName,
    format: 'ULFO'
  }
}

module.exports = configuration
