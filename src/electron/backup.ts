import fs from 'fs'
import path from 'path'
import { getBackupLocation, getSaveLocation } from '../data/Defaults/data'
import { app } from 'electron'

export const backupMexJSON = () => {
  const backupFolder = getBackupLocation(app)
  if (!fs.existsSync(backupFolder)) fs.mkdirSync(backupFolder)

  const timestamp = Math.round(+new Date() / 1000)
  const backupFileName = `mex.json.bak.${timestamp}`
  const backupFilePath = path.join(backupFolder, backupFileName)

  const ogFilePath = getSaveLocation(app)
  const symlinkFilePath = ogFilePath + '.bak'

  fs.copyFileSync(ogFilePath, backupFilePath)
  fs.symlinkSync(backupFilePath, symlinkFilePath)
}
