import React, { useEffect } from 'react'
import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import IconButton from '../../../style/Buttons'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { ErrorBoundary } from 'react-error-boundary'
import tinykeys from 'tinykeys'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { ServiceContainer, GroupHeaderContainer, FloatingIcon } from './styled'
import { Button } from '@workduck-io/mex-components'

type ServiceInfoProps = {}

const ServiceInfo: React.FC<ServiceInfoProps> = ({ children }) => {
  const { goTo } = useRouting()
  const { shortcutDisabled } = useKeyListener()

  const goBackToIntegrations = () => goTo(ROUTE_PATHS.integrations, NavigationType.replace)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) goBackToIntegrations()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <ErrorBoundary
      FallbackComponent={() => <Button onClick={() => goTo(ROUTE_PATHS.home, NavigationType.replace)}>Back</Button>}
    >
      <ServiceContainer>
        <GroupHeaderContainer>
          <FloatingIcon>
            <IconButton
              size={24}
              shortcut={`Esc`}
              icon={arrowLeftLine}
              onClick={goBackToIntegrations}
              title={'Return to Integrations'}
            />
          </FloatingIcon>
          {children}
        </GroupHeaderContainer>
      </ServiceContainer>
    </ErrorBoundary>
  )
}

export default ServiceInfo
