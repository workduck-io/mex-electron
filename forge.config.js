const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');

module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'mex',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: './assets/icon.png',
        format: 'ULFO',
      },
    },
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
              name: 'mex_window',
            },
            {
              html: './src/Spotlight/index.html',
              js: './src/Spotlight/index.tsx',
              name: 'spotlight_window',
            },
          ],
        },
      },
    ],
  ],
  hooks: {
    readPackageJson: async (forgeConfig, packageJson) => {
      // only copy deps if there isn't any
      if (Object.keys(packageJson.dependencies).length === 0) {
        const originalPackageJson = await fs.readJson(path.resolve(__dirname, 'package.json'));
        const webpackConfigJs = require('./webpack.main.config.js');
        Object.keys(webpackConfigJs.externals).forEach(package => {
          packageJson.dependencies[package] = originalPackageJson.dependencies[package];
        });
      }
      return packageJson;
    },
    packageAfterPrune: async (forgeConfig, buildPath) => {
      console.log(buildPath);
      return new Promise((resolve, reject) => {
        const npmInstall = spawn('npm', ['install'], {
          cwd: buildPath,
          stdio: 'inherit',
        });

        npmInstall.on('close', code => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error('process finished with error code ' + code));
          }
        });

        npmInstall.on('error', error => {
          reject(error);
        });
      });
    },
  },
};
