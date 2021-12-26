import { App } from 'electron'
import path from 'path'

export const DataFileName = 'mex.json'

export const getSearchIndexLocation = (app: App) => path.join(app.getPath('userData'), 'search_index')
export const getSaveLocation = (app: App) => path.join(app.getPath('userData'), DataFileName)
