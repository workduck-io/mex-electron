import React, { useEffect } from 'react'

import Content from './Content'
import Search from './Search'
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
