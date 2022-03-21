const signAsync = require('electron-osx-sign').signAsync
const path = require('path')

function main(arch) {
  // Needed because the codesign utility calls the arch as x86_64 instead of just x64 :(
  const temp = arch === 'x64' ? 'x86_64' : arch

  const opts = {
    app: path.join(process.cwd(), `out/Mex-darwin-${arch}/Mex.app`),
    'hardened-runtime': true,
    entitlements: path.join(process.cwd(), 'build/entitlements.plist'),
    'entitlements-inherit': path.join(process.cwd(), 'build/entitlements.plist'),
    'signature-flags': 'library',
    'gatekeeper-assess': false,
    arch: 'arm64,x86_64'
  }

  signAsync(opts)
    .then(() => console.log('App Successfully Signed'))
    .catch((err) => console.log('Failed with error: ', err))
}

const arch = process.argv[2]
main(arch)
