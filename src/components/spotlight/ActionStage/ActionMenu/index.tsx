import React, { useState, useEffect } from 'react'
import Default from './Default'
import Menu from './Menu'
import tinykeys from 'tinykeys'

type ActionMenuProps = {
  title: string
  shortcut?: string
}

const ActionMenu: React.FC<ActionMenuProps> = ({ title, shortcut }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+K': (event) => {
        event.preventDefault()
        setIsOpen((p) => !p)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  if (!isOpen) return <Default title={title} setIsOpen={setIsOpen} shortcut={shortcut} />

  return <Menu />
}

export default ActionMenu
