import semver from 'semver'
import fs from 'fs'
import _ from 'lodash'

import packageJson from '../package.json'
import configJson from '../src/config.json'

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

const packageJsonValues = {
  [BUILD_TYPE.ALPHA]: {
    PRODUCT_NAME: 'Mex Alpha',
    NAME: 'mex-alpha'
  },
  [BUILD_TYPE.STABLE]: {
    PRODUCT_NAME: 'Mex',
    NAME: 'mex'
  }
}

const configValues = {
  [BUILD_TYPE.ALPHA]: {
    STAGE: 'alpha',
    MEX_BACKEND_BASE_URL: 'https://http-test.workduck.io/mex'
  },
  [BUILD_TYPE.STABLE]: {
    STAGE: 'stable',
    MEX_BACKEND_BASE_URL: 'https://http.workduck.io/mex'
  }
}

const packageJsonPaths = {
  NAME: 'name',
  PRODUCT_NAME: 'productName'
}

const configJsonpaths = {
  STAGE: 'constants.STAGE',
  MEX_BACKEND_BASE_URL: 'constants.MEX_BACKEND_BASE_URL'
}

Object.entries(packageJsonValues[buildStage]).forEach(([key, value]) => {
  _.set(packageJson, packageJsonPaths[key], value)
})

Object.entries(configValues[buildStage]).forEach(([key, value]) => {
  _.set(configJson, configJsonpaths[key], value)
})

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, '  '))
fs.writeFileSync('./src/config.json', JSON.stringify(configJson, null, '  '))
