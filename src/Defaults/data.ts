import { App } from 'electron'
import path from 'path'

export const DataFileName = 'mex.json'
export const SettingsFileName = 'settings.json'
export const SpotlightSettingsFilename = 'spotlight_settings.json'

export const getDataSaveLocation = (app: App) => path.join(app.getPath('userData'), DataFileName)
export const getSettingsSaveLocation = (app: App) => path.join(app.getPath('userData'), SettingsFileName)
export const getSpotlightSettingsSaveLocation = (app: App) =>
  path.join(app.getPath('userData'), SpotlightSettingsFilename)
