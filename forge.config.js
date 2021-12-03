const externalsWin = ['active-win-universal', 'ffi-napi', 'ref-napi', 'iconv']
const externalsDarwin = ['active-win-universal']

const externals = process.platform === 'darwin' ? externalsDarwin : externalsWin

module.exports = {
  packagerConfig: {
    icon: 'assets/icon.icns'
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
              html: './src/index.html',
              js: './src/index.tsx',
              name: 'mex_window'
            },
            {
              html: './src/Spotlight/index.html',
              js: './src/Spotlight/index.tsx',
              name: 'spotlight_window'
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
