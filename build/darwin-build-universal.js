// Code not correct, needs to be fixed. For now, use different binaries for different arch

const { makeUniversalApp } = require('@electron/universal')
const path = require('path')

const makeUniversalBinary = async () =>
  await makeUniversalApp({
    x64AppPath: path.join(process.cwd(), 'out/Mex-darwin-x64/Mex.app'),
    arm64AppPath: path.join(process.cwd(), 'out/Mex-darwin-arm64/Mex.app'),
    outAppPath: path.join(process.cwd(), 'out/Mex-darwin-universal/Mex.app')
  })

function main() {
  makeUniversalBinary()
    .then(() => console.log('Successfully made universal binary'))
    .catch((err) => console.log('Error: ', err))
}

main()
