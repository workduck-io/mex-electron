import {
  getTokenLocation,
  getMentionLocation,
  getSaveLocation,
  getSearchIndexLocation,
  getBeforeUpdateDataLocation
} from '@data/Defaults/data'
import { app } from 'electron'

export const TOKEN_LOCATION = getTokenLocation(app)
export const MENTION_LOCATION = getMentionLocation(app)
export const SAVE_LOCATION = getSaveLocation(app)
export const SEARCH_INDEX_LOCATION = getSearchIndexLocation(app)
export const TEMP_DATA_BEFORE_UPDATE = getBeforeUpdateDataLocation(app)
