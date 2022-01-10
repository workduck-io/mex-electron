import React from 'react'
import { FallbackProps } from 'react-error-boundary'
import { CardShadow } from '../../Styled/helpers'
import styled from 'styled-components'
import { Button } from '../../Styled/Buttons'
import { Title } from '../../Styled/Typography'
import { transparentize } from 'polished'

const ErrorWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.large};
`
const ErrorCard = styled.div`
  ${CardShadow}
  padding: ${({ theme: { spacing } }) => spacing.large};
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  border: 1px solid ${({ theme }) => transparentize(0.75, theme.colors.palette.red)};
`

const EditorErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <ErrorWrapper role="alert">
      <ErrorCard>
        <Title>Ooops Something went wrong</Title>
        <pre>Error: {error.message}</pre>
        <p>You can reset the editor to the last state.</p>
        <Button onClick={resetErrorBoundary}>Reset Editor</Button>
      </ErrorCard>
    </ErrorWrapper>
  )
}

export default EditorErrorFallback