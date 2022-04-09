const { version } = require('./package.json')
const semver = require('semver')

const externalsWin = ['active-win-universal', 'ffi-napi', 'ref-napi', 'iconv']
const externalsDarwin = ['active-win-universal']

const externals = process.platform === 'darwin' ? externalsDarwin : externalsWin

const checkAlpha = (version) => {
  const parsed = semver.parse(version)
  if (parsed.prerelease[0] === 'alpha') return true

  return false
}
const isAlpha = checkAlpha(version)

const appBundleId = isAlpha ? 'com.workduck.mex-alpha' : 'com.workduck.mex'
const icon = isAlpha ? 'assets/icon-alpha.icns' : 'assets/icon.icns'

module.exports = {
  electronRebuildConfig: {
    forceABI: 101
  },
  packagerConfig: {
    icon: icon,
    appBundleId: appBundleId,
    protocols: [
      {
        protocol: 'mex',
        name: 'mex',
        schemes: 'mex'
      }
    ],
    extendInfo: {
      NSAppleEventsUsageDescription: 'Mex can control other applications with AppleScript.'
    }
  },
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/mex.html',
              js: './src/index.mex.tsx',
              name: 'mex_window'
            },
            {
              html: './src/spotlight.html',
              js: './src/index.spotlight.tsx',
              name: 'spotlight_window'
            },
            {
              html: './src/toast.html',
              js: './src/index.toast.tsx',
              name: 'toast_window'
            }
          ]
        }
      }
    ],
    [
      '@timfish/forge-externals-plugin',
      {
        externals: externals,
        includeDeps: true
      }
    ]
  ]
}
