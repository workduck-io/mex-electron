import React, { useEffect } from 'react'

import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { ErrorBoundary } from 'react-error-boundary'

import { Button, IconButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { useKeyListener } from '../../../hooks/useShortcutListener'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import { ServiceContainer, GroupHeaderContainer, FloatingIcon } from './styled'

type ServiceInfoProps = {
  children: React.ReactElement | React.ReactElement[]
}

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
