import styled from 'styled-components'
import { transparentize } from 'polished'

export const Element = styled.span<{ show: boolean }>`
  border-radius: ${(props) => props.theme.borderRadius.tiny};
  margin: 4px 0;
  background-color: ${(props) => props.show && transparentize(0.05, props.theme.colors.background.highlight)};
`

export const BlockElement = styled.div`
  background-color: ${(props) => props.theme.colors.background.highlight};
  border-radius: ${(props) => props.theme.borderRadius.small};
  margin-bottom: ${(props) => props.theme.spacing.small};
  padding: ${(props) => props.theme.spacing.medium};
  display: flex;
  align-items: center;
`

export const BlockSelectorInput = styled.input`
  border-radius: 50% !important;
  margin-right: ${(props) => props.theme.spacing.medium} !important;
  border: none;
  :focus {
    outline: none !important;
  }
`

export const BlockModal = styled.div``
