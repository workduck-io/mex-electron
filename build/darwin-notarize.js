const notarize = require('electron-notarize').notarize
const path = require('path')

const notarizeApp = async (arch) => {
  await notarize({
    tool: 'notarytool',
    appPath: path.join(process.cwd(), `out/Mex-darwin-${arch}/Mex.app`),
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  })
}

function main(arch) {
  notarizeApp(arch)
    .then(() => console.log('App Notarized Successfully!'))
    .catch((err) => console.log(err))
}

const arch = process.argv[2]
main(arch)
