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
  RECIEVE_LOCAL_DATA = 'RECIEVE_LOCAL_DATA',
  GET_LOCAL_INDEX = 'GET_LOCAL_INDEX',
  SET_LOCAL_INDEX = 'SET_LOCAL_INDEX',
  SET_UPDATE_FREQ = 'SET_UPDATE_FREQ'
}
