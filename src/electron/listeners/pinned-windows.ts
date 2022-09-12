import { IpcAction } from "@data/IpcAction"
import { createNoteWindow } from "@electron/utils/helper"
import { windowManager } from "@electron/WindowManager"
import { mog } from "@utils/lib/helper"
import { ipcMain } from "electron"

const handlePinnedWindowsIPCListener = () => {
  // * Pinned Window IPC Liteners
  ipcMain.on(IpcAction.SHOW_PINNED_NOTE_WINDOW, (_event, arg) => {
    const { data, from } = arg

    mog("CALLING", { data, from })
    if (data?.noteId) {
      const ref = windowManager.getWindow(data?.noteId)

      ref?.show()
      ref?.focus()
    }
  })

  ipcMain.on(IpcAction.PIN_NOTE_WINDOW, (_event, data) => {
    createNoteWindow(data)
  })

  ipcMain.on(IpcAction.UNPIN_NOTE, (_event, arg) => {
    const { data } = arg
    if (data?.noteId) {
      windowManager.deleteWindow(data.noteId)
    }
  })

}

export default handlePinnedWindowsIPCListener
