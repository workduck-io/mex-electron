import React, { useEffect, useState } from 'react'
import useShortcutListener from '../../Hooks/useCustomShortcuts/useShortcutListener'
import { useShortcutStore } from '../../Editor/Store/ShortcutStore'
import { Heading, Description } from '../../Spotlight/components/SearchResults/styled'
import { InputBlock } from '../../Styled/Form'
import { CenterSpace } from '../../Styled/Layouts'

const InputShortcut = () => {
  const keybinding = useShortcutStore((state) => state.keybinding)
  const [value, setValue] = useState('')

  useShortcutListener()

  useEffect(() => {
    if (keybinding) {
      setValue(keybinding)
    }
  }, [keybinding])

  return (
    <CenterSpace>
      <Heading>Enter new Shortcut</Heading>
      <InputBlock center autoFocus value={value} />
      <br />
      <Description>
        Press <strong>Esc</strong> to reset or hit <strong>Enter</strong> to save
      </Description>
    </CenterSpace>
  )
}

export default InputShortcut
