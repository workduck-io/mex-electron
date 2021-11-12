const createDMG = require('electron-installer-dmg')
const fs = require('fs')

const cwd = process.cwd()
const path = require('path')

function buildDMG(arch) {
  return createDMG({
    appPath: path.join(cwd, `out/Mex-darwin-${arch}/Mex.app`),
    name: 'Mex',
    title: 'Mex',
    icon: path.join(cwd, './node_modules/electron-installer-dmg/resources/mac/atom.icns'),
    iconSize: 80,
    background: path.join(cwd, './assets/icon.png'),
    format: 'ULFO',
    contents: [
      { x: 448, y: 144, type: 'link', path: '/Applications' },
      {
        x: 192,
        y: 144,
        type: 'file',
        path: path.join(cwd, './out/Mex-darwin-arm64/Mex.app')
      }
    ],
    overwrite: true,
    out: path.join(cwd, 'out/make')
  })
}

function getPackageVersion() {
  const data = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json')))
  return data.version
}

function main(arch) {
  buildDMG(arch)
    .then(() => {
      const version = getPackageVersion()
      const newFilename = `Mex-${version}-${arch}.dmg`
      fs.renameSync(path.join(cwd, 'out/make/Mex.dmg'), path.join(cwd, 'out/make', newFilename))
    })
    .catch((err) => console.log(err))
}

const arch = process.argv[2]
main(arch)
