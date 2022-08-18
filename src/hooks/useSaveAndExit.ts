import { useEffect, useState } from 'react'

import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'
import { useSaver } from '../editor/Components/Saver'
import { useUserService } from '@services/auth/useUserService'

export const useSaveAndExit = () => {
  const [saved, setSaved] = useState(true)
  const { updateUserPreferences } = useUserService()

  const { onSave } = useSaver()

  useEffect(() => {
    if (!saved) {
      // Save user preferences to server
      updateUserPreferences()
      // Save data to disk
      onSave()
    }
  }, [saved]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    ipcRenderer.once(IpcAction.SAVE_AND_EXIT, () => {
      setSaved(false)
    })
  }, [])

  return [saved]
}
