import React, { useState, useEffect } from 'react'
import Default from './Default'
import Menu from './Menu'
import tinykeys from 'tinykeys'
import useActionMenuStore from './useActionMenuStore'

type ActionMenuProps = {
  title: string
  shortcut?: string
}

const ActionMenu: React.FC<ActionMenuProps> = ({ title, shortcut }) => {
  const isOpen = useActionMenuStore((store) => store.isActionMenuOpen)
  const toggleActionMenu = useActionMenuStore((store) => store.toggleActionMenu)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+K': (event) => {
        event.preventDefault()
        toggleActionMenu()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  if (!isOpen) return <Default title={title} shortcut={shortcut} />

  return <Menu />
}

export default ActionMenu
