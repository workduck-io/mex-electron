import { getGlobal } from '@electron/remote'
import React, { useEffect } from 'react'
import { mog } from '../../../utils/lib/helper'
import { useVersionStore } from '../../../store/useAppDataStore'
// import { useAuthStore } from '../../../services/auth/useAuth'

export const VersionSetter = () => {
  const setVersion = useVersionStore((s) => s.setVersion)

  useEffect(() => {
    const version = getGlobal('appVersion')
    if (version) {
      setVersion(version)
    }
  })

  return <div style={{ display: 'none' }}>{}</div>
}
