import { app } from 'electron'
import fs from 'fs'
import path from 'path'

import { getBackupLocation, getSaveLocation } from '../data/Defaults/data'

export const backupMexJSON = () => {
  try {
    const backupFolder = getBackupLocation(app)
    if (!fs.existsSync(backupFolder)) fs.mkdirSync(backupFolder)

    const backupFileName = `mex-${app.getVersion()}.json.bak`
    const backupFilePath = path.join(backupFolder, backupFileName)

    const ogFilePath = getSaveLocation(app)
    const symlinkFilePath = ogFilePath + '.bak'

    fs.copyFileSync(ogFilePath, backupFilePath)
    fs.rmSync(symlinkFilePath, { force: true })
    fs.symlinkSync(backupFilePath, symlinkFilePath)
  } catch (error) {
    console.error('Failed to backup: ', error)
  }
}
