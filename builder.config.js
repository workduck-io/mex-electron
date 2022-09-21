/* eslint-disable @typescript-eslint/no-var-requires */

const { version, productName } = require('./package.json')
const semver = require('semver')

const checkAlpha = (version) => {
  const parsed = semver.parse(version)
  return parsed.prerelease[0] === 'alpha'
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
  files: [
    'dist/**',
    '!node_modules/vis-network/**',
    '!node_modules/date-fns/**',
    '!node_modules/@udecode/**',
    '!node_modules/@babel/**',
    '!node_modules/lottie-web/**',
    '!node_modules/vis-data/**',
    '!node_modules/@testing-library/**',
    '!node_modules/@excalidraw/**',
    '!node_modules/styled-components/**',
    '!node_modules/polished/**',
    '!node_modules/react-dom/**',
    '!node_modules/react/**',
    '!node_modules/react**/**',
    '!node_modules/core-js/**',
    '!node_modules/rxjs/**',
    '!node_modules/@uifabric/**',
    '!node_modules/prismjs/**',
    '!node_modules/lodash/**'
  ],
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
