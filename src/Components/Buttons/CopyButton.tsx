import React, { useEffect, useState } from 'react'
import IconButton from '../../Styled/Buttons'
import fileCopyLine from '@iconify-icons/ri/file-copy-line'
import checkboxLine from '@iconify-icons/ri/checkbox-line'
import ReactTooltip from 'react-tooltip'

interface CopyButtonProps {
  text: string
  size?: string
}

export const CopyButton = ({ text, size }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    ReactTooltip.rebuild()
  })
  // This is the function we wrote earlier
  const copyTextToClipboard = async (text: string) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(text)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 3000)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <IconButton
      onClick={handleCopyClick}
      icon={isCopied ? checkboxLine : fileCopyLine}
      size={size}
      title={isCopied ? 'Copied to Clipboard' : 'Copy'}
    ></IconButton>
  )
}
