import React from 'react'
import Search from '../Search'
import Content from '../Content'
import Shortcuts, { ShortcutType } from '../Shortcuts'
import { StyledLookup } from './styled'
import { useSpotlightContext } from '../../../Spotlight/utils/context'
import CreateNodeInput from '../CreateNodeInput'

const Spotlight = () => {
  const { selection } = useSpotlightContext()
  return (
    <StyledLookup>
      {selection ? <CreateNodeInput /> : <Search />}
      <Content />
      <Shortcuts type={ShortcutType.NEW} />
    </StyledLookup>
  )
}

export default Spotlight
