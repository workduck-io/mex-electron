import { Input } from '../../Styled/Form'
import styled, { css } from 'styled-components'

export const StyledInputWrapper = styled.div`
  width: 100%;
  position: relative;
`

export const StyledCombobox = styled.div`
  display: flex;
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.medium};
  font-size: 1.2rem;
  align-items: center;
  ${Input} {
    width: 100%;
  }
  svg {
    margin-left: ${({ theme }) => theme.spacing.small};
    color: ${({ theme }) => theme.colors.text.fade};
    &.errorIcon {
      color: ${({ theme }) => theme.colors.palette.red};
    }
    &.okayIcon {
      color: ${({ theme }) => theme.colors.palette.green};
    }
  }
`

interface SuggestionProps {
  highlight: boolean
}

export const Suggestion = styled.li<SuggestionProps>`
  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  margin: ${({ theme }) => `${theme.spacing.tiny} 0`};

  border-radius: ${({ theme }) => theme.borderRadius.tiny};

  ${({ theme, highlight }) =>
    highlight &&
    css`
      background-color: ${theme.colors.primary};
      color: ${theme.colors.text.oppositePrimary};
    `}
`

interface MenuProps {
  isOpen: boolean
  highlightFirst: boolean
}

export const StyledMenu = styled.ul<MenuProps>`
  padding: ${({ theme }) => theme.spacing.small};
  margin-top: 0;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  width: calc(100% - (2 * ${({ theme }) => theme.spacing.small}));
  max-height: 20rem;
  overflow-y: auto;
  overflow-x: hidden;
  outline: 0;
  transition: opacity 0.1s ease;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  z-index: 1000;

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  ${({ isOpen }) =>
    !isOpen &&
    css`
      border: none;
      display: none;
    `}

  ${({ highlightFirst, theme }) =>
    highlightFirst &&
    css`
      ${Suggestion}:first-child {
        background-color: ${theme.colors.gray[7]};
      }
    `}
`
