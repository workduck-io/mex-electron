import notFound from '@iconify/icons-fluent/document-one-page-24-filled'
import { Icon } from '@iconify/react'
import React from 'react'
import styled, { useTheme } from 'styled-components'
import { Button } from '../style/Buttons'
import { NotFoundText } from '../style/Form'
import { NavigationType, ROUTE_PATHS, useRouting } from './routes/urls'

const NotFoundContainer = styled(NotFoundText)`
  height: 100vh;
  text-align: center;
  ${Button} {
    margin-top: 2rem;
  }
`

const NotFound = () => {
  const theme = useTheme()
  const { goTo } = useRouting()

  const handleHomeClick = () => {
    goTo(`${ROUTE_PATHS.settings}/themes`, NavigationType.replace)
  }

  return (
    <NotFoundContainer>
      <Icon color={theme.colors.primary} fontSize={128} icon={notFound} />
      <p>Where are you? This page doesn&apos;t exist.</p>
      <Button onClick={handleHomeClick}>Home</Button>
    </NotFoundContainer>
  )
}

export default NotFound
