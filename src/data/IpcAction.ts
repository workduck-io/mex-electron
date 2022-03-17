/* eslint-disable import/prefer-default-export */
export const DEFAULT_PREVIEW_TEXT = ''

export enum IpcAction {
  SYNC_DATA = 'SYNC_DATA',
  INIT_HEAP_INSTANCE = 'INIT_HEAP_INSTANCE',
  START_ONBOARDING = 'START_ONBOARDING',
  STOP_ONBOARDING = 'STOP_ONBOARDING',
  SET_SPOTLIGHT_SHORTCUT = 'SET_SPOTLIGHT_SHORTCUT',
  SAVE_AND_EXIT = 'SAVE_AND_EXIT',
  OPEN_NODE_IN_MEX = 'OPEN_NODE_IN_MEX',
  REDIRECT_TO = 'REDIRECT_TO',
  OPEN_NODE = 'OPEN_NODE',
  CLOSE_SPOTLIGHT = 'CLOSE_SPOTLIGHT',
  LOGGED_IN = 'LOGGED_IN',
  GET_LOCAL_DATA = 'GET_LOCAL_DATA',
  SET_LOCAL_DATA = 'SET_LOCAL_DATA',
  SAVE_AND_QUIT = 'SAVE_AND_QUIT',
  DISABLE_GLOBAL_SHORTCUT = 'DISABLE_GLOBAL_SHORTCUT',
  SELECTED_TEXT = 'SELECTED_TEXT',
  SPOTLIGHT_BUBBLE = 'SPOTLIGHT_BUBBLE',
  ERROR_OCCURED = 'ERROR_OCCURED',
  NEW_RECENT_ITEM = 'NEW_RECENT_ITEM',
  SPOTLIGHT_BLURRED = 'SPOTLIGHT_BLURRED',
  CLEAR_RECENTS = 'CLEAR_RECENTS',
  RECEIVE_LOCAL_DATA = 'RECEIVE_LOCAL_DATA',
  GET_LOCAL_INDEX = 'GET_LOCAL_INDEX',
  SET_LOCAL_INDEX = 'SET_LOCAL_INDEX',
  SET_UPDATE_FREQ = 'SET_UPDATE_FREQ',
  CREATE_NEW_NODE = 'CREATE_NEW_NODE',
  OPEN_PREFERENCES = 'OPEN_PREFERENCES',
  IMPORT_APPLE_NOTES = 'IMPORT_APPLE_NOTES',
  SET_APPLE_NOTES_DATA = 'SET_APPLE_NOTES_DATA',
  SET_THEME = 'SET_THEME',

  // * Snippets
  COPY_TO_CLIPBOARD = 'COPY_TO_CLIPBOARD',
  USE_SNIPPET = 'USE_SNIPPET',

  // * Updates
  CHECK_FOR_UPDATES = 'CHECK_FOR_UPDATES',

  // * Toast
  SHOW_TOAST = 'SHOW_TOAST',
  HIDE_TOAST = 'HIDE_TOAST',
  TOAST_MESSAGE = 'TOAST_MESSAGE',

  // * Sync Index
  // Not needed anymore since index is maintained in search worker
  // SYNC_INDEX = 'SYNC_INDEX',

  // * Worker
  ANALYSE_CONTENT = 'WORKER:ANALYSE',
  RECEIVE_ANALYSIS = 'WORKER:RECEIVE_ANALYSIS',

  // * Search Worker
  ADD_DOCUMENT = 'SEARCH_WORKER:ADD_DOCUMENT',
  UPDATE_DOCUMENT = 'SEARCH_WORKER:UPDATE_DOCUMENT',
  REMOVE_DOCUMENT = 'SEARCH_WORKER:REMOVE_DOCUMENT',
  QUERY_INDEX = 'SEARCH_WORKER:QUERY_INDEX'
}
