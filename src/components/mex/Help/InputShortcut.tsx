import React, { useEffect, useState } from 'react'
import { CenterSpace } from '../../../style/Layouts'
import useShortcutListener from '../../../hooks/useShortcutListener'
import { useShortcutStore } from '../../../store/useShortcutStore'
import { Heading, Description } from '../../spotlight/SearchResults/styled'
import { InputBlock } from '../../../style/Form'

const InputShortcut = () => {
  const keybinding = useShortcutStore((state) => state.keybinding)
  const [value, setValue] = useState('')

  const currentShortcut = useShortcutStore((state) => state.currentShortcut)
  const resetStore = useShortcutStore((state) => state.resetStore)

  useShortcutListener()

  useEffect(() => {
    return () => resetStore()
  }, [resetStore])

  useEffect(() => {
    if (keybinding) {
      setValue(keybinding.alias.trim())
    }
  }, [keybinding])

  return (
    <CenterSpace>
      <Heading>Enter new shortcut for {currentShortcut.title} </Heading>
      <InputBlock center autoFocus value={value} />
      <br />
      <Description>
        Press <strong>Esc</strong> to reset or hit <strong>Enter</strong> to save
      </Description>
    </CenterSpace>
  )
}

export default InputShortcut
