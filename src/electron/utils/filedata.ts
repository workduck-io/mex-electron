import { app } from 'electron'
import fs from 'fs'
import { FileData } from '../../types/data'
import { DefaultFileData } from '../../data/Defaults/baseData'
import { applyTransforms, requiresTransform } from '../../utils/dataTransform'
import { UpdateVersionTransforms } from '../../data/transforms'

export const getFileData = (location: string) => {
  if (fs.existsSync(location)) {
    const stringData = fs.readFileSync(location, 'utf-8')
    const data = JSON.parse(stringData)
    const writeToFile = requiresTransform(data)

    if (!writeToFile) return data

    const fileData = applyTransforms(data, UpdateVersionTransforms)
    fs.writeFileSync(location, JSON.stringify(fileData))

    console.log('MEX: Applied Transforms to data')

    return fileData
  } else {
    const version = app.getVersion()
    fs.writeFileSync(location, JSON.stringify(DefaultFileData(version)))
    console.log('Getting data', { version })
    return DefaultFileData(version)
  }
}

export const setFileData = (data: FileData, location: string) => {
  fs.writeFileSync(location, JSON.stringify(data))
}
