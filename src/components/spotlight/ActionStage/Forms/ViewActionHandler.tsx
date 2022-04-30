import React from 'react'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import Loading from '../../../../style/Loading'
import { useTheme } from 'styled-components'
import WDLogo from '../../Search/Logo'
import { useActionStore } from '../../Actions/useActionStore'

const ViewActionHandler = () => {
  const view = useSpotlightAppStore((store) => store.view)
  const isLoading = useSpotlightAppStore((store) => store.isLoading)
  const isSubmitting = useActionStore((store) => store.isSubmitting)
  const theme = useTheme()

  switch (view) {
    // return <ActionFormSubmit />
    case 'form':
    case 'item':
    default:
      return isLoading && !isSubmitting ? <Loading color={theme.colors.primary} dots={3} transparent /> : <WDLogo />
  }
}

export default ViewActionHandler
