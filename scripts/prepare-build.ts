import packageJson from '../package.json'
import fs from 'fs'
import semver from 'semver'

export enum BUILD_TYPE {
  ALPHA = 'ALPHA',
  STABLE = 'STABLE'
}

export const getBuildStage = (version: string): BUILD_TYPE => {
  const parsed = semver.parse(version)

  if (!parsed) {
    console.error('Could not parse package version: ', version)
    process.exit()
  }

  if (parsed.prerelease[0] === 'alpha') return BUILD_TYPE.ALPHA
  if (!parsed.prerelease.length && !parsed.build.length) return BUILD_TYPE.STABLE

  console.error('Could not determine build stage from package version')
  process.exit()
}

const { version } = packageJson
const buildStage = getBuildStage(version)

const configValues = {
  [BUILD_TYPE.ALPHA]: {
    PRODUCT_NAME: 'Eba Alpha',
    NAME: 'eba-alpha',
    ICON: 'assets/icon.alpha.icns'
  },
  [BUILD_TYPE.STABLE]: {
    PRODUCT_NAME: 'Eba',
    NAME: 'eba',
    ICON: 'assets/icon.stable.icns'
  }
}

const packageJsonPaths = {
  NAME: 'name',
  PRODUCT_NAME: 'productName'
}

packageJson[packageJsonPaths.NAME] = configValues[buildStage].NAME
packageJson[packageJsonPaths.PRODUCT_NAME] = configValues[buildStage].PRODUCT_NAME

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, '  '))
fs.copyFileSync(configValues[buildStage].ICON, 'assets/icon.icns')
