import { DefaultFileData } from '../../data/Defaults/baseData'
import { UpdateVersionTransforms } from '../../data/transforms'
import { AuthTokenData } from '../../types/auth'
import { applyTransforms, requiresTransform } from '../../utils/dataTransform'
import { app } from 'electron'
import fs from 'fs'

export const getFileData = (location: string) => {
  if (fs.existsSync(location)) {
    const stringData = fs.readFileSync(location, 'utf-8')
    const data = JSON.parse(stringData)
    const writeToFile = requiresTransform(data)

    if (!writeToFile) return data

    const { data: fileData } = applyTransforms(data, UpdateVersionTransforms)
    setDataAtLocation(fileData, location)

    return fileData
  } else {
    const version = app.getVersion()
    setDataAtLocation(DefaultFileData(version), location)
    return DefaultFileData(version)
  }
}

export const setFileData = (data: AuthTokenData, location: string) => {
  fs.writeFileSync(location, JSON.stringify(data))
}

export const getDataOfLocation = (location: string): any => {
  if (fs.existsSync(location)) {
    const stringData = fs.readFileSync(location, 'utf-8')
    const data = JSON.parse(stringData)
    return data
  } else {
    const version = app.getVersion()
    fs.writeFileSync(location, JSON.stringify({}))
    console.log('GettingData', { version, location })
    return {}
  }
}

export const setDataAtLocation = (data: any, location: string) => {
  fs.writeFileSync(location, JSON.stringify(data))
}
