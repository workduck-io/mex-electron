import React from 'react'
import { useHelpStore } from './HelpModal'

const useShortcutTableData = () => {
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const columns = React.useMemo(
    () => [
      {
        Header: 'Shortcut',
        accessor: 'title' // accessor is the "key" in the data
      },
      {
        Header: 'Keybinding',
        accessor: 'keystrokes'
      },

      {
        Header: 'Catergory',
        accessor: 'category'
      }
    ],
    []
  )

  const data = React.useMemo(() => {
    const shortcutData = Object.keys(shortcuts).map((k) => ({
      title: shortcuts[k].title,
      keystrokes: shortcuts[k].keystrokes,
      category: shortcuts[k].category ?? 'General'
    }))

    return shortcutData
  }, [shortcuts])

  return { data, columns }
}

export default useShortcutTableData
