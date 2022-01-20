import React, { useEffect, useState } from 'react'
import { useContentStore } from '../../../store/useContentStore'
import { StyledMessage } from './styled'

const Message: React.FC<{ text: string }> = ({ text }) => {
  const [show, setShow] = useState<boolean>(true)
  const setSaved = useContentStore((state) => state.setSaved)

  useEffect(() => {
    const timeId = setTimeout(() => {
      setShow(false)
      setSaved(false)
    }, 2500)

    return () => clearTimeout(timeId)
  }, [])

  if (!show) return null

  return <StyledMessage>{text}</StyledMessage>
}

export default Message
