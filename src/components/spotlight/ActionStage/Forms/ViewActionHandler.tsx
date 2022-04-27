import React from 'react'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import Loading from '../../../../style/Loading'
import ActionFormSubmit from './ActionFormSubmit'
import { useTheme } from 'styled-components'
import WDLogo from '../../Search/Logo'

const ViewActionHandler = () => {
  const view = useSpotlightAppStore((store) => store.view)
  const isLoading = useSpotlightAppStore((store) => store.isLoading)
  const theme = useTheme()

  switch (view) {
    // return <ActionFormSubmit />
    case 'form':
    case 'item':
    default:
      return isLoading ? <Loading color={theme.colors.primary} dots={3} transparent /> : <WDLogo />
  }
}

export default ViewActionHandler
