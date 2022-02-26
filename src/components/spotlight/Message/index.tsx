import React, { useEffect, useState } from 'react'

import { AppType } from '../../../hooks/useInitialize'
import { IpcAction } from '../../../data/IpcAction'
import { StyledMessage } from './styled'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { useContentStore } from '../../../store/useContentStore'

const Message: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState<boolean>(true)
  const setSaved = useContentStore((state) => state.setSaved)

  useEffect(() => {
    const timeId = setTimeout(() => {
      setShow(false)
      appNotifierWindow(IpcAction.CLOSE_SPOTLIGHT, AppType.SPOTLIGHT, { hide: true })
      setSaved(false)
    }, 1500)

    return () => clearTimeout(timeId)
  }, [])

  if (!show) return null

  return <StyledMessage>{text}</StyledMessage>
}

export default Message
