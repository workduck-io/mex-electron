import Shortcuts, { ShortcutType } from '../Shortcuts'

import CreateNodeInput from '../CreateNodeInput'
import NewEditor from './NewEditor'
import React from 'react'
import { StyledLookup } from '../styled'

const MexIt = () => {
  return (
    <StyledLookup>
      <CreateNodeInput />
      <NewEditor />
      <Shortcuts type={ShortcutType.NEW} />
    </StyledLookup>
  )
}

export default MexIt
