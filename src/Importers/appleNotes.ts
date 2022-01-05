import { runAppleScript } from 'run-applescript'
import { AppleNotesImporterScriptURL } from '../Defaults/data'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { app, dialog } from 'electron'
import { globby } from 'globby'
import { Iconv } from 'iconv'

const iconv = new Iconv('UTF-16', 'UTF-8')
const notesPath = path.join(app.getPath('userData'), 'AppleNotes')

const downloadAppleScript = (scriptSaveLocation: string) => {
  const file = fs.createWriteStream(scriptSaveLocation)
  https.get(AppleNotesImporterScriptURL, (res) => {
    res.pipe(file)
    file.on('finish', () => {
      file.close()
    })
  })
}

const fixEncodingHTML = (filename: string) => {
  const buff = fs.readFileSync(filename)

  fs.rmSync(filename)

  const result = iconv.convert(buff).toString('utf-8')

  fs.writeFileSync(filename, result, 'utf-8')
}

const saveNotesHTML = async (scriptSaveLocation: string) => {
  const script = fs.readFileSync(scriptSaveLocation, 'utf-8')
  await runAppleScript(script)

  const files = await globby(notesPath + '/*.html')
  files.forEach((file) => {
    parseAppleNotesTitle(file)
    fixEncodingHTML(file)
  })
}

const parseAppleNotesTitle = (filepath: string) => {
  const filename = path.basename(filepath).trim()
  console.log('Filename: ', filename)

  const splitName = filename.split(']')

  const APID = splitName[0].replace('[', '') // Apple Notes ID
  const nodeTitle = splitName[1].trim().replace('.html', '')

  return { APID, nodeTitle }
}

export const getAppleNotes = async (scriptSaveLocation: string) => {
  // downloadAppleScript(scriptSaveLocation)

  if (!fs.existsSync(notesPath)) fs.mkdirSync(notesPath)
  await saveNotesHTML(scriptSaveLocation)

  const selectedFilesRet = await dialog.showOpenDialog({
    defaultPath: notesPath,
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'HTML Files',
        extensions: ['html']
      }
    ],
    message: 'Choose the Notes You Would Like to Import'
  })
  if (selectedFilesRet.canceled) return
  const selectedFilePaths = selectedFilesRet.filePaths

  selectedFilePaths.forEach((path) => {
    const { APID, nodeTitle } = parseAppleNotesTitle(path)
  })
}
