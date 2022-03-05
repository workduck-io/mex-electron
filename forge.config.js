const externalsWin = ['active-win-universal', 'ffi-napi', 'ref-napi', 'iconv']
const externalsDarwin = ['active-win-universal']

const externals = process.platform === 'darwin' ? externalsDarwin : externalsWin

module.exports = {
  electronRebuildConfig: {
    forceABI: 101
  },
  packagerConfig: {
    icon: 'assets/icon.icns',
    extendInfo: {
      NSAppleEventsUsageDescription: 'Mex can control other applications with AppleScript.'
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'mex',
        setupIcon: 'assets/icon.ico'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO'
      }
    }
  ],
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
