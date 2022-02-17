import React from 'react'
import Search from './Search'
import Content from './Content'
import { StyledLookup } from './styled'
import { mog } from '../../utils/lib/helper'

const Spotlight = () => {
  mog('Spotlight', {})

  return (
    <StyledLookup>
      <Search />
      <Content />
    </StyledLookup>
  )
}

export default Spotlight
