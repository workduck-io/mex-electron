import React, { useRef } from 'react'
import styled, { css } from 'styled-components'
import { darken } from 'polished'

export const ElementContainer = styled.div<{ isInline?: boolean; flex?: number }>`
  ${({ isInline }) =>
    isInline &&
    css`
      display: inline-block;
    `}
  flex: ${({ flex }) => flex || 'inherit'};
`

const ActionElementLabel = styled.span<{ required?: boolean }>`
  ${({ required }) =>
    required &&
    css`
      &::after {
        content: '*';
        /* padding: 0.3rem 10px; */
        margin-left: 0.2rem;
        color: ${({ theme }) => theme.colors.text.disabled};
        font-size: 0.9rem;
        font-weight: 500;
      }
    `}
  color: ${({ theme }) => theme.colors.text.default};
  font-size: 0.8rem;
  margin-top: 1rem;
  user-select: none;
`

const ElementHeader = styled.div`
  /* flex: 5; */
  align-items: center;
  justify-content: space-between;
  display: flex;
  gap: 0.5rem;
`

const ActionElementErrorText = styled.span`
  color: ${({ theme }) => darken(0.15, theme.colors.palette.red)};
  font-size: 0.8rem;
  font-weight: 700;
  user-select: none;
  margin-top: 1rem;
`

type ActionFormElementProps = {
  label?: string
  required?: boolean
  isInline?: boolean
  flex?: number
}

const ActionFormElement: React.FC<ActionFormElementProps> = ({ label, required, children, isInline, flex }) => {
  const ref = useRef<HTMLDivElement>(null)

  const scrollThere = () => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  return (
    <ElementContainer ref={ref} onClick={scrollThere} isInline={isInline} flex={flex}>
      {label && (
        <ElementHeader>
          <ActionElementLabel required={required}>{label}</ActionElementLabel>
          {/* {required && <ActionElementErrorText>Required!</ActionElementErrorText>} */}
        </ElementHeader>
      )}
      {children}
    </ElementContainer>
  )
}

export default ActionFormElement
