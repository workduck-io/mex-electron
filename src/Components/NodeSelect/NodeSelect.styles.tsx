import { Input } from '../../Styled/Form'
import styled, { css } from 'styled-components'

export const StyledInputWrapper = styled.div`
  width: 100%;
  position: relative;
`

export const StyledCombobox = styled.div`
  display: inline-block;
  display: flex;
  width: 100%;
  ${Input} {
    width: 100%;
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`

interface MenuProps {
  isOpen: boolean
}

export const StyledMenu = styled.ul<MenuProps>`
  padding: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.small};
  position: absolute;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  width: calc(100% - (2 * ${({ theme }) => theme.spacing.small}));
  max-height: 20rem;
  overflow-y: auto;
  overflow-x: hidden;
  outline: 0;
  transition: opacity 0.1s ease;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
  border: 1px solid ${({ theme }) => theme.colors.primary};

  ${({ isOpen }) =>
    !isOpen &&
    css`
      border: none;
      display: none;
    `}
`

interface SuggestionProps {
  highlight: boolean
}

export const Suggestion = styled.li<SuggestionProps>`
  padding: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};

  ${({ theme, highlight }) =>
    highlight &&
    css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.text.oppositePrimary};
    `}
`
