import fs from 'fs'
import { FileData } from '../../types/data'
import { DefaultFileData } from '../../data/Defaults/baseData'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ensureFieldsOnJSON = (fileData: any) => {
  let toWriteFile = false
  Object.keys(DefaultFileData).forEach((value) => {
    if (!(value in fileData)) {
      fileData[value] = DefaultFileData[value]
      toWriteFile = true
    }
  })
  return { fileData, toWriteFile }
}

export const getFileData = (location: string) => {
  if (fs.existsSync(location)) {
    const stringData = fs.readFileSync(location, 'utf-8')

    const { fileData, toWriteFile } = ensureFieldsOnJSON(JSON.parse(stringData))
    if (toWriteFile) fs.writeFileSync(location, JSON.stringify(fileData))
    return fileData
  } else {
    fs.writeFileSync(location, JSON.stringify(DefaultFileData))
    return DefaultFileData
  }
}

export const setFileData = (data: FileData, location: string) => {
  fs.writeFileSync(location, JSON.stringify(data))
}
