import React from 'react'
import Search from '../Search'
import Content from '../Content'
import { StyledLookup } from './styled'
import { useSpotlightContext } from '../../../Spotlight/utils/context'
import { useSpotlightAppStore } from '../../../Spotlight/store/app'

const Spotlight = () => {
  return (
    <StyledLookup>
      <Search />
      <Content />
    </StyledLookup>
  )
}

export default Spotlight
