import React from 'react'
import Search from './Search'
import { SpotlightContainer } from './styled'
import { Outlet } from 'react-router-dom'

const Spotlight = () => {
  return (
    <SpotlightContainer id="wd-mex-spotlight-container">
      <Search />
      <Outlet />
    </SpotlightContainer>
  )
}

export default Spotlight
