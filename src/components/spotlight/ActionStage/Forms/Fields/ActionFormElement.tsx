import React from 'react'
import styled from 'styled-components'
import { FormField } from '@workduck-io/action-request-helper'
import { darken } from 'polished'

const StyledActionFormContainer = styled.div`
  display: flex;
  margin: ${({ theme }) => theme.spacing.tiny};
  align-items: center;
  gap: 0 1rem;
`

const ActionElementLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.default};
  font-size: 0.8rem;
  flex: 3;
  margin-top: 1rem;
  user-select: none;
  text-align: right;
`

const ElementContainer = styled.div`
  flex: 5;
  align-items: flex-start;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0 0.5rem;
`

const ActionElementErrorText = styled.span`
  color: ${({ theme }) => darken(0.15, theme.colors.palette.red)};
  font-size: 0.8rem;
  font-weight: 700;
  user-select: none;
  margin-top: 1rem;
`

type ActionFormElementProps = {
  element: FormField
}

const ActionFormElement: React.FC<ActionFormElementProps> = ({ element, children }) => {
  return (
    <StyledActionFormContainer>
      <ActionElementLabel>{element.label}</ActionElementLabel>
      <ElementContainer>
        {children}
        {element.options.required && <ActionElementErrorText>Required!</ActionElementErrorText>}
      </ElementContainer>
    </StyledActionFormContainer>
  )
}

export default ActionFormElement
