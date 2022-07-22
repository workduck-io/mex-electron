import React from 'react'
import { FallbackProps } from 'react-error-boundary'
import { CardShadow } from '../../../style/helpers'
import styled, { createGlobalStyle } from 'styled-components'
import { Title } from '../../../style/Typography'
import { transparentize } from 'polished'

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  height: 100vh;
  color: ${({ theme }) => theme.colors.text.default};
  background-color: ${({ theme }) => theme.colors.gray[10]};
`

const ErrorCard = styled.div`
  ${CardShadow}
  padding: ${({ theme: { spacing } }) => spacing.large};
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  border: 1px solid ${({ theme }) => transparentize(0.75, theme.colors.palette.red)};
  max-width: 600px;
  max-height: 800px;
`
const SimpleGlobalStyle = createGlobalStyle`
  body, html {
    height: 100vh;
    width: 100vw;
    margin: 0;
  }

`

const INIT_ERROR = "Cannot read properties of undefined (reading 'init')"
const INIT_ERROR_USER = `Mex could not initialize properly,
Please restart with a stable connection to continue.`

const MexErrorFallback = (p: FallbackProps) => {
  const { error } = p
  let message = 'It looks like Mex encountered an error.'

  if (error.message === INIT_ERROR) {
    console.log({ error, p })
    message = INIT_ERROR_USER
  }

  return (
    <ErrorWrapper role="alert">
      <SimpleGlobalStyle />
      <ErrorCard>
        <Title>Ooops Something went wrong</Title>
        <pre>Error: {error.message}</pre>
        <p>{message}</p>
      </ErrorCard>
    </ErrorWrapper>
  )
}

export default MexErrorFallback
