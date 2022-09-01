/* eslint-disable @typescript-eslint/no-var-requires */

const { version, productName } = require('./package.json')
const semver = require('semver')

const checkAlpha = (version) => {
  const parsed = semver.parse(version)
  if (parsed.prerelease[0] === 'alpha') return true

  return false
}
const isAlpha = checkAlpha(version)

const appBundleId = isAlpha ? 'com.workduck.mex-alpha' : 'com.workduck.mex'
const updateServerPath = isAlpha ? 'https://http-test.workduck.io/updates/' : 'https://http.workduck.io/updates/'

/** @type {import('electron-builder').Configuration} */
const configuration = {
  publish: [
    {
      provider: 'generic',
      url: updateServerPath
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
  files: ['dist/**', '!node_modules/vis-network/**', '!node_modules/date-fns/**', '!node_modules/@udecode/**'],
  appId: appBundleId,
  afterSign: 'electron-builder-notarize',
  buildDependenciesFromSource: true,
  asar: true,
  asarUnpack: ['dist/*.js'],
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
        arch: ['x64', 'arm64']
      },
      {
        target: 'dmg',
        arch: ['x64', 'arm64']
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
