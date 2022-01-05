import { runAppleScript } from 'run-applescript'
import { AppleNotesImporterScriptURL } from '../Defaults/data'
import https from 'https'
import fs from 'fs'
import path from 'path'
import { app } from 'electron'
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
  console.log('Filename: ', filename)
  const buff = fs.readFileSync(filename)

  fs.rmSync(filename)

  const result = iconv.convert(buff).toString('utf-8')

  fs.writeFileSync(filename, result, 'utf-8')
  console.log('Wrote file ', filename)
}

export const getAppleNotes = async (scriptSaveLocation: string) => {
  // downloadAppleScript(scriptSaveLocation)

  if (!fs.existsSync(notesPath)) fs.mkdirSync(notesPath)

  console.log('Notes path: ', notesPath)
  const script = fs.readFileSync(scriptSaveLocation, 'utf-8')
  await runAppleScript(script)

  const files = await globby(notesPath + '/*.html')
  files.forEach((file) => {
    fixEncodingHTML(file)
  })
}
