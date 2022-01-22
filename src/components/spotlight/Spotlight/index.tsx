import React from 'react'
import Search from '../Search'
import Content from '../Content'
import { StyledLookup } from './styled'

const Spotlight = () => {
  return (
    <StyledLookup>
      <Search />
      <Content />
    </StyledLookup>
  )
}

export default Spotlight
