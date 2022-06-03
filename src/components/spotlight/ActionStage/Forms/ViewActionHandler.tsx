import React from 'react'
import Loading from '../../../../style/Loading'
import { useTheme } from 'styled-components'
import WDLogo from '../../Search/Logo'
import { useActionStore } from '../../Actions/useActionStore'

const ViewActionHandler = () => {
  const view = useActionStore((store) => store.view)
  const isLoading = useActionStore((store) => store.isLoading)
  const isSubmitting = useActionStore((store) => store.isSubmitting)
  const theme = useTheme()

  switch (view) {
    case 'form':
    case 'item':
    default:
      return isLoading && !isSubmitting ? <Loading color={theme.colors.primary} dots={3} transparent /> : <WDLogo />
  }
}

export default ViewActionHandler
