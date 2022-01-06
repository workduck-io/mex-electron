import { runAppleScript } from 'run-applescript'
import { AppleNotesImporterScriptURL } from '../Defaults/data'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { app, dialog } from 'electron'
import { globby } from 'globby'
import { Iconv } from 'iconv'

export interface AppleNote {
  APID: string
  NoteTitle: string
  HTMLContent: string
  nodeUID?: string
}

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

  const splitName = filename.split(']')

  const APID = splitName[0].replace('[', '') // Apple Notes ID
  const NoteTitle = splitName[1].trim().replace('.html', '').replace('.', '')

  return { APID, NoteTitle }
}

export const getAppleNotes = async (scriptSaveLocation: string) => {
  if (!fs.existsSync(scriptSaveLocation)) return null

  downloadAppleScript(scriptSaveLocation)

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
  if (selectedFilesRet.canceled) return null
  const selectedFilePaths = selectedFilesRet.filePaths

  const ret = new Array<AppleNote>()

  selectedFilePaths.forEach((path) => {
    const { APID, NoteTitle } = parseAppleNotesTitle(path)
    const HTMLContent = fs.readFileSync(path, 'utf-8')
    const t: AppleNote = {
      APID,
      NoteTitle,
      HTMLContent
    }

    ret.push(t)
  })

  return ret
}
