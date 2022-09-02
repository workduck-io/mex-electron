import fs from 'fs'
import path from 'path'
import semver from 'semver'
import spawn from 'spawndamnit'

import { version } from '../package.json'

const checkAlpha = (version) => {
  const parsed = semver.parse(version) as semver.SemVer
  return parsed.prerelease[0] === 'alpha'
}

const isAlpha = checkAlpha(version)
const s3BucketName = isAlpha ? 's3://mex-electron-alpha-updates' : 's3://mex-electron-updates'
const updateInfoFile = isAlpha ? 'alpha-mac.yml' : 'latest-mac.yml'

const filesToUpload = new Set(
  fs
    .readdirSync('out', { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)
    .filter((file) => {
      const extension = path.extname(file).toLowerCase()

      if (extension === '.dmg' || extension === '.zip' || extension === '.blockmap') return true
      else if (file === updateInfoFile) return true

      return false
    })
)

fs.readdirSync('out').forEach((dirent) => {
  if (!filesToUpload.has(dirent)) {
    console.log('Deleting: ', dirent)
    fs.rmSync(path.join('out', dirent), { force: true, recursive: true })
  }
})

const clearS3Bucket = async () => {
  const child = spawn('aws', ['s3', 'rm', s3BucketName, '--recursive'])
  child.on('stdout', (data) => console.log(data.toString()))
  child.on('stderr', (data) => console.error(data.toString()))

  await child
}

const uploadToS3 = async () => {
  const child = spawn('aws', ['s3', 'sync', 'out', s3BucketName])

  child.on('stdout', (data) => console.log(data.toString()))
  child.on('stderr', (data) => console.error(data.toString()))

  await child
}

clearS3Bucket().then(() => {
  console.log('Cleared Bucket. Uploading latest files')
  uploadToS3()
})
