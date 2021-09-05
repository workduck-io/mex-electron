import React from 'react'
import Shortcuts, { ShortcutType } from '../Shortcuts'
import { StyledLookup } from '../Spotlight/styled'
import { useMexPageShortcuts } from '../../utils/context'

import NewEditor from './NewEditor'
import CreateNodeInput from '../CreateNodeInput'

const New = () => {
  useMexPageShortcuts()

  return (
    <StyledLookup>
      <CreateNodeInput />
      <NewEditor />
      <Shortcuts type={ShortcutType.NEW} />
    </StyledLookup>
  )
}

export default New
