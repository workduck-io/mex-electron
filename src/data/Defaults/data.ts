import { App } from 'electron'
import path from 'path'

export const DataFileName = 'mex.json'
export const TokenFileName = 'token.json'
export const MentionFileName = 'mention.json'
export const BackupFolderName = 'backups'
export const AppleNotesImporterScriptURL = 'https://mex-scripts.s3.ap-south-1.amazonaws.com/fetchAppleNotes.applescript'

export const getSearchIndexLocation = (app: App) => path.join(app.getPath('userData'), 'search_index')
export const getSaveLocation = (app: App) => path.join(app.getPath('userData'), DataFileName)
export const getBackupLocation = (app: App) => path.join(app.getPath('userData'), BackupFolderName)
export const getTokenLocation = (app: App) => path.join(app.getPath('userData'), TokenFileName)
export const getMentionLocation = (app: App) => path.join(app.getPath('userData'), MentionFileName)
