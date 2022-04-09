import { signAsync } from 'electron-osx-sign'
import { notarize } from 'electron-notarize'
import createDMG from 'electron-installer-dmg'
import { zipSync } from 'cross-zip'

import path from 'path'
import fs from 'fs'

import { BUILD_TYPE, getBuildStage } from './prepare-build'
import packageJson from '../package.json'

const osxSign = async () => {
  const opts = {
    app: appPath,
    'hardened-runtime': true,
    entitlements: path.join(process.cwd(), 'build/entitlements.plist'),
    'entitlements-inherit': path.join(process.cwd(), 'build/entitlements.plist'),
    'signature-flags': 'library',
    'gatekeeper-assess': false,
    arch: 'arm64,x86_64'
  }

  try {
    await signAsync(opts)
    console.log('App Successfully Signed')
  } catch (error) {
    throw new Error(`App Signing Failed with error ${error}`)
  }
}

const notarizeApp = async () => {
  await notarize({
    tool: 'notarytool',
    appPath: appPath,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID
  })

  console.log('App Successfully Notarized')
}

const buildDMG = async () => {
  await createDMG({
    appPath: appPath,
    name: productName,
    title: productName,
    icon: appIcon,
    iconSize: 80,
    format: 'ULFO',
    contents: [
      { x: 448, y: 144, type: 'link', path: '/Applications' },
      {
        x: 192,
        y: 144,
        type: 'file',
        path: appPath
      }
    ],
    overwrite: true,
    out: path.join(process.cwd(), 'out/make'),
    additionalDMGOptions: {
      window: {
        size: { width: 600, height: 320 }
      }
    }
  })
  const newFilename = `${productName}-${version}-mac-${arch}.dmg`
  const oldPath = path.join(process.cwd(), 'out', 'make', `${productName}.dmg`)
  const newPath = path.join(process.cwd(), 'out', 'make', newFilename)
  fs.renameSync(oldPath, newPath)

  console.log('DMG Build Successully')
}

const buildZip = () => {
  const inPath = appPath
  const outPath = path.join(process.cwd(), 'out', 'make', `${productName}-${version}-mac-${arch}.zip`)

  zipSync(inPath, outPath)

  console.log('Built Zip File from App Bundle Successfully')
}

const main = async () => {
  await osxSign()
  await notarizeApp()
  await buildDMG()
  buildZip()
}

const { version, productName } = packageJson
const buildStage = getBuildStage(version)

const arch = process.argv[2]
const appPath = path.join(process.cwd(), 'out', `${productName}-darwin-${arch}`, `${productName}.app`)
const appIcon = buildStage === BUILD_TYPE.ALPHA ? 'assets/icon-alpha.icns' : 'assets/icon.icns'

main()
