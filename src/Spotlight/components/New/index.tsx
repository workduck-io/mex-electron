import React, { useEffect } from 'react'
import Shortcuts, { ShortcutType } from '../Shortcuts'
import { StyledLookup } from '../Spotlight/styled'
import { useMexPageShortcuts } from '../../utils/context'
import { CenterIcon } from '../../styles/layout'
import WDLogo from '../Search/Logo'
import { StyledHeader, StyledHeading } from './styled'
import NewEditor from './NewEditor'

const New = () => {
  useMexPageShortcuts()

  return (
    <StyledLookup>
      <StyledHeader>
        <StyledHeading>New Mex</StyledHeading>
        <CenterIcon>
          <WDLogo />
        </CenterIcon>
      </StyledHeader>
      <NewEditor />
      <Shortcuts type={ShortcutType.NEW} />
    </StyledLookup>
  )
}

export default New
