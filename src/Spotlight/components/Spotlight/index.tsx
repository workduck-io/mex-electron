import React from 'react'
import Search from '../Search'
import Content from '../Content'
import Shortcuts, { ShortcutType } from '../Shortcuts'
import { StyledLookup } from './styled'

const Spotlight = () => {
  return (
    <StyledLookup>
      <Search />
      <Content />
      <Shortcuts type={ShortcutType.HOME} />
    </StyledLookup>
  )
}

export default Spotlight
