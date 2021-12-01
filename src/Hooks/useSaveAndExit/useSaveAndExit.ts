import { useEffect, useState } from 'react'
import { useSaver } from '../../Editor/Components/Saver'

import { ipcRenderer } from 'electron'

import { IpcAction } from '../../Spotlight/utils/constants'

export const useSaveAndExit = () => {
  const [saved, setSaved] = useState(true)

  const { onSave } = useSaver()

  useEffect(() => {
    if (!saved) {
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