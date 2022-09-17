import { IpcAction } from '@data/IpcAction'
import { windowManager } from '@electron/WindowManager'
import { windows } from '@electron/main'
import {
  MENTION_LOCATION,
  SAVE_LOCATION,
  SEARCH_INDEX_LOCATION,
  TEMP_DATA_BEFORE_UPDATE,
  TOKEN_LOCATION
} from '@electron/utils/fileLocations'
import { getDataOfLocation, getFileData, setDataAtLocation, setFileData } from '@electron/utils/filedata'
import { copyToClipboard, getGlobalShortcut, useSnippetFromClipboard } from '@electron/utils/getSelectedText'
import {
  closeWindow,
  createMexWindow,
  createNoteWindow,
  createSpotLighWindow,
  handleToggleMainWindow,
  notifyOtherWindow
} from '@electron/utils/helper'
import { getIndexData } from '@electron/utils/indexData'
import {
  addDoc,
  analyseContent,
  initSearchIndex,
  removeDoc,
  searchIndex,
  searchIndexByNodeId,
  searchIndexWithRanking,
  updateDoc
} from '@electron/worker/controller'
import { getReminderDimensions, REMINDERS_DIMENSIONS } from '@services/reminders/reminders'
import { clearLocalStorage } from '@utils/dataTransform'
import { getAppleNotes } from '@utils/importers/appleNotes'
import { app, globalShortcut, ipcMain } from 'electron'
import fs from 'fs'

import { AuthTokenData } from '../../types/auth'
import { FileData } from '../../types/data'
import { MentionData } from '../../types/mentions'
import { Reminder, ReminderActions } from '../../types/reminders'
import { idxKey } from '../../types/search'
import { ToastStatus, ToastType } from '../../types/toast'
import handlePinnedWindowsIPCListener from './pinned-windows'
import { checkForUpdatesAndNotifyWrapper } from '../update'

export let SPOTLIGHT_SHORTCUT = 'CommandOrCOntrol+Shift+X'

enum AppType {
  SPOTLIGHT = 'SPOTLIGHT',
  MEX = 'MEX',
  TOAST = 'TOAST'
}

const handleIPCListener = () => {
  ipcMain.on('close', closeWindow)

  ipcMain.on(IpcAction.UPDATE_ILINKS, (event, data) => {
    windowManager.sendToWindow(AppType.SPOTLIGHT, IpcAction.UPDATE_ILINKS, data)
  })

  ipcMain.on(IpcAction.UPDATE_ACTIONS, (event, data) => {
    windowManager.sendToWindow(AppType.SPOTLIGHT, IpcAction.UPDATE_ACTIONS, data)
  })

  ipcMain.on(IpcAction.SET_SPOTLIGHT_SHORTCUT, (event, arg) => {
    const newSpotlightShortcut = getGlobalShortcut(arg.shortcut)
    if (newSpotlightShortcut !== SPOTLIGHT_SHORTCUT) {
      globalShortcut.unregister(SPOTLIGHT_SHORTCUT)
      globalShortcut.register(newSpotlightShortcut, handleToggleMainWindow)
      SPOTLIGHT_SHORTCUT = newSpotlightShortcut
    }
  })

  ipcMain.on(IpcAction.GO_FORWARD, (event, arg) => {
    event.sender.goForward()
  })

  ipcMain.on(IpcAction.GO_BACK, (event, arg) => {
    event.sender.goBack()
  })

  ipcMain.on(IpcAction.USE_SNIPPET, (event, arg) => {
    const { data, from } = arg
    windowManager.getWindow(from)?.hide()
    app.hide()
    useSnippetFromClipboard(data.text, data.html)
  })

  ipcMain.on(IpcAction.COPY_TO_CLIPBOARD, (event, arg) => {
    const { data, from } = arg
    copyToClipboard(data.text, data.html)

    if (!data?.hideToast) {
      let spotlightRef = windowManager.getWindow(AppType.SPOTLIGHT)

      if (!spotlightRef) {
        spotlightRef = createSpotLighWindow()
      }

      if (spotlightRef) windows?.toast?.setParent(spotlightRef)
      windows?.toast?.send(IpcAction.TOAST_MESSAGE, { status: ToastStatus.SUCCESS, title: data.title })
      windows?.toast?.open()
    }
  })

  ipcMain.on(IpcAction.DISABLE_GLOBAL_SHORTCUT, (event, arg) => {
    const { disable } = arg
    if (disable) globalShortcut.unregisterAll()
    else globalShortcut.register(SPOTLIGHT_SHORTCUT, handleToggleMainWindow) // * If more than one global listener, use registerAll
  })

  ipcMain.on(IpcAction.GET_TOKEN_DATA, async (event) => {
    const tokenData: AuthTokenData = getDataOfLocation(TOKEN_LOCATION)
    event.sender.send(IpcAction.RECIEVE_TOKEN_DATA, tokenData)
  })

  ipcMain.on(IpcAction.SET_TOKEN_DATA, (_event, arg) => {
    setDataAtLocation(arg, TOKEN_LOCATION)
    const tokenData: AuthTokenData = arg || getDataOfLocation(TOKEN_LOCATION)

    windowManager.sendToWindow(AppType.MEX, IpcAction.RECIEVE_TOKEN_DATA, tokenData)
    windowManager.sendToWindow(AppType.SPOTLIGHT, IpcAction.RECIEVE_TOKEN_DATA, tokenData)
  })

  // Mentions Data
  ipcMain.on(IpcAction.GET_MENTION_DATA, async (event) => {
    const mentionData: MentionData = getDataOfLocation(MENTION_LOCATION)
    event.sender.send(IpcAction.RECIEVE_MENTION_DATA, mentionData)
  })

  ipcMain.on(IpcAction.SET_MENTION_DATA, (_event, arg) => {
    setDataAtLocation(arg, MENTION_LOCATION)
    const mentionData: MentionData = arg || getDataOfLocation(MENTION_LOCATION)

    windowManager.sendToWindow(AppType.MEX, IpcAction.RECIEVE_MENTION_DATA, mentionData)
    windowManager.sendToWindow(AppType.SPOTLIGHT, IpcAction.RECIEVE_MENTION_DATA, mentionData)
  })

  ipcMain.on(IpcAction.GET_LOCAL_DATA, async (event) => {
    const fileData: FileData = getFileData(SAVE_LOCATION)
    const isUpdate = app.getVersion() !== fileData.version

    // Needed for this upgrade, because of dwindle changes
    if (isUpdate && clearLocalStorage(fileData.version, app.getVersion())) {
      windowManager.sendToWindow(AppType.MEX, IpcAction.FORCE_SIGNOUT)
    }

    const indexData: Record<idxKey, any> = getIndexData(SEARCH_INDEX_LOCATION)
    await initSearchIndex(fileData, indexData)
    event.sender.send(IpcAction.RECEIVE_LOCAL_DATA, { fileData })
  })

  ipcMain.on(IpcAction.SET_THEME, (ev, arg) => {
    const { data } = arg
    windows.toast?.send(IpcAction.SET_THEME, data.theme)
  })

  ipcMain.on(IpcAction.SET_LOCAL_DATA, (_event, arg) => {
    setFileData(arg, SAVE_LOCATION)
  })

  ipcMain.on(IpcAction.ANALYSE_CONTENT, async (event, arg) => {
    if (!arg) return
    await analyseContent(arg, (analysis) => {
      event.sender.send(IpcAction.RECEIVE_ANALYSIS, analysis)
    })
  })

  ipcMain.on(IpcAction.CHECK_FOR_UPDATES, (_event, arg) => {
    if (arg.from === AppType.SPOTLIGHT) {
      let spotlightRef = windowManager.getWindow(AppType.SPOTLIGHT)

      if (!spotlightRef) {
        spotlightRef = createSpotLighWindow()
      }

      if (spotlightRef) windows.toast?.setParent(spotlightRef)

      windows.toast?.send(IpcAction.TOAST_MESSAGE, { status: ToastStatus.LOADING, title: 'Checking for updates..' })
      windows.toast?.open(false, false, true)

      checkForUpdatesAndNotifyWrapper()
    }
  })

  ipcMain.on(IpcAction.CLEAR_RECENTS, (_event, arg) => {
    const { from } = arg
    notifyOtherWindow(IpcAction.CLEAR_RECENTS, from)
  })

  ipcMain.on(IpcAction.SHOW_RELEASE_NOTES, (_event, arg) => {
    fs.unlinkSync(TEMP_DATA_BEFORE_UPDATE)
  })

  // * Uncomment, if not using syncStore for recents
  // ipcMain.on(IpcAction.NEW_RECENT_ITEM, (_event, arg) => {
  //   const { from, data } = arg
  //   // mog('Add new recent item', { from, data })
  //   notifyOtherWindow(IpcAction.NEW_RECENT_ITEM, from, data)
  // })

  ipcMain.on(IpcAction.START_ONBOARDING, (_event, arg) => {
    const { from, data } = arg
    notifyOtherWindow(IpcAction.START_ONBOARDING, from, data)
  })

  ipcMain.on(IpcAction.STOP_ONBOARDING, (_event, arg) => {
    const { from } = arg
    notifyOtherWindow(IpcAction.STOP_ONBOARDING, from)
  })

  ipcMain.on(IpcAction.OPEN_MODAL_IN_MEX, (_event, arg) => {
    windowManager.sendToWindow(AppType.MEX, IpcAction.OPEN_MODAL, { type: arg.type, data: arg.data })
    windowManager.getWindow(AppType.SPOTLIGHT)?.hide()
    windowManager.getWindow(AppType.MEX)?.focus()
    windowManager.getWindow(AppType.MEX)?.show()
  })

  ipcMain.on(IpcAction.OPEN_NODE_IN_MEX, (_event, arg) => {
    const windowRef = windowManager.getWindow(AppType.MEX)
    if (!windowRef) {
      createMexWindow((window) => {
        window.webContents.send(IpcAction.OPEN_NODE, { nodeid: arg.nodeid })
      })
    } else {
      windowManager.sendToWindow(AppType.MEX, IpcAction.OPEN_NODE, { nodeid: arg.nodeid })
      windowManager.getWindow(AppType.MEX)?.focus()
      windowManager.getWindow(AppType.MEX)?.show()
    }

    windowManager.getWindow(AppType.SPOTLIGHT)?.hide()
  })

  ipcMain.on(IpcAction.REDIRECT_TO, (_event, arg) => {
    const mexWindowRef = windowManager.getWindow(AppType.MEX)

    if (!mexWindowRef)
      createMexWindow((window) => {
        window.webContents.send(IpcAction.REDIRECT_TO, { page: arg.page })
      })
    else {
      mexWindowRef?.focus()
      mexWindowRef?.show()
    }
  })

  ipcMain.on(
    IpcAction.ACTION_REMINDER,
    (ev, { from, data }: { from: AppType; data: { action: ReminderActions; reminder: Reminder; time?: number } }) => {
      windowManager.sendToWindow(AppType.SPOTLIGHT, IpcAction.ACTION_REMINDER, data)
    }
  )

  ipcMain.on(IpcAction.OPEN_REMINDER_IN_MEX, (ev, { from, data }: { from: AppType; data: { reminder: Reminder } }) => {
    const mexWindowRef = windowManager.getWindow(AppType.MEX)

    if (!mexWindowRef) {
      createMexWindow((window) => {
        window.webContents.send(IpcAction.OPEN_REMINDER, { reminder: data.reminder })
      })
    } else {
      mexWindowRef.focus()
      mexWindowRef.show()
    }
  })

  ipcMain.on(IpcAction.RESIZE_REMINDER, (ev, { from, data }: { from: AppType; data: { height: number } }) => {
    const { height } = data
    windows.toast?.updateReminderSize({ height, width: REMINDERS_DIMENSIONS.width }, true)
  })

  ipcMain.on(IpcAction.SHOW_REMINDER, (ev, { from, data }: { from: AppType; data: ToastType }) => {
    if (data.attachment) {
      const size = getReminderDimensions(data.attachment)
      windows.toast?.send(IpcAction.TOAST_MESSAGE, data)
      windows.toast?.openReminder(size)
    } else {
      console.error('Attach reminder groups with data to display reminders ')
    }
  })

  ipcMain.on(IpcAction.HIDE_REMINDER, () => {
    windows.toast?.hide()
  })

  ipcMain.on(IpcAction.SHOW_TOAST, (ev, { from, data }: { from: AppType; data: ToastType }) => {
    const parentWindow = windowManager.getWindow(from)
    windows.toast?.setParent(parentWindow)

    windows.toast?.send(IpcAction.TOAST_MESSAGE, data)
    windows.toast?.open(data.independent)
  })

  ipcMain.on(IpcAction.HIDE_TOAST, () => {
    windows.toast?.hide()
  })

  ipcMain.on(IpcAction.CLOSE_SPOTLIGHT, (_event, arg) => {
    const { data, from } = arg
    if (data?.hide) {
      windowManager.getWindow(from)?.hide()
    }
  })

  ipcMain.on(IpcAction.REFRESH_NODE, (_event, arg) => {
    const { data, from } = arg
    if (data?.nodeid) {
      windowManager.sendToWindow(from, IpcAction.REFRESH_NODE, data)
    }
  })

  ipcMain.handle(IpcAction.IMPORT_APPLE_NOTES, async () => {
    const selectedAppleNotes = await getAppleNotes()
    return selectedAppleNotes
  })

  // Handlers for Search Worker Operations
  ipcMain.handle(IpcAction.ADD_DOCUMENT, async (_event, key, nodeId, contents, title, tags, extra) => {
    await addDoc(key, nodeId, contents, title, tags, extra)
  })

  ipcMain.handle(IpcAction.UPDATE_DOCUMENT, async (_event, key, nodeId, contents, title, tags, extra) => {
    await updateDoc(key, nodeId, contents, title, tags, extra)
  })

  ipcMain.handle(IpcAction.REMOVE_DOCUMENT, async (_event, key, id) => {
    await removeDoc(key, id)
  })

  ipcMain.handle(IpcAction.QUERY_INDEX, async (_event, key, query, options) => {
    const results = await searchIndex(key, query, options)
    return results
  })

  ipcMain.handle(IpcAction.QUERY_INDEX_BY_NODEID, async (_event, key, nodeId, query) => {
    const results = await searchIndexByNodeId(key, nodeId, query)
    return results
  })

  ipcMain.handle(IpcAction.QUERY_INDEX_WITH_RANKING, async (_event, key, query, options) => {
    const results = await searchIndexWithRanking(key, query, options)
    return results
  })

  ipcMain.handle(IpcAction.VERSION_GETTER, async (_event) => {
    const version = app.getVersion()
    return version
  })

  // * Pinned Window IPC listener
  handlePinnedWindowsIPCListener()
}

export default handleIPCListener
