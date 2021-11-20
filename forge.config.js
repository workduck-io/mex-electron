const { inherits } = require("util")

module.exports = {
  packagerConfig: {
    icon: 'assets/icon.icns',
    osxSign: {
      'hardened-runtime': true,
      entitlements: 'build/entitlements.plist',
      'entitlements-inherit':'build/entitlements.plist',
      'signature-flags': 'library',
      'gatekeeper-assess': false,
    },
    osxNotarize: {
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'mex'
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
            }
          ]
        }
      }
    ],
    [
      '@timfish/forge-externals-plugin',
      {
        externals: ['active-win-universal'],
        includeDeps: true
      }
    ]
  ]
}
