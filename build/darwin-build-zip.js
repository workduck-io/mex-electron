const { zipSync } = require('cross-zip')
const path = require('path')
const { version } = require('../package.json')

function main(arch) {
  const inPath = path.join(process.cwd(), `out/Mex-darwin-${arch}/Mex.app`)
  const outPath = path.join(process.cwd(), `out/make/Mex-${version}-mac-${arch}.zip`)

  zipSync(inPath, outPath)
}

const arch = process.argv[2]
main(arch)
