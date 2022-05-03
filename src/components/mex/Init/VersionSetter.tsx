import { ipcRenderer } from 'electron'
import React, { useEffect } from 'react'
import { IpcAction } from '@data/IpcAction'
import { useVersionStore } from '@store/useAppDataStore'

export const VersionSetter = () => {
  const setVersion = useVersionStore((s) => s.setVersion)

  useEffect(() => {
    const handleVersionSet = async () => {
      const version = await ipcRenderer.invoke(IpcAction.VERSION_GETTER)
      if (version) setVersion(version)
    }
    handleVersionSet()
  }, [])

  return <div style={{ display: 'none' }}>{ }</div>
}
