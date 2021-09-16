import React from 'react'
import Shortcuts, { ShortcutType } from '../Shortcuts'
import { StyledLookup } from '../Spotlight/styled'
import { useMexItShortcuts } from '../../shortcuts/useMexItShortcuts'

import NewEditor from './NewEditor'
import CreateNodeInput from '../CreateNodeInput'

const New = () => {
  // useMexItShortcuts()

  return (
    <StyledLookup>
      <CreateNodeInput />
      <NewEditor />
      <Shortcuts type={ShortcutType.NEW} />
    </StyledLookup>
  )
}

export default New
