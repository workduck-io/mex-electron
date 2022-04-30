import styled, { css } from 'styled-components'
import { focusStyles } from '../../../style/focus'
import { FocusModeProp } from '../../../style/props'

export const TitlebarWrapper = styled.div<FocusModeProp>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.large}`};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  ${(props) => focusStyles(props)}
`

export const TitlebarControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const NavigationButtons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  svg {
    height: 24px;
    width: 24px;
  }
`

export const VerticalSeparator = styled.div`
  height: 12px;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.gray[7]};
  margin: 0 ${({ theme }) => theme.spacing.small};
`

export const NavigationButton = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.25;
      pointer-events: none;
    `}

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[8]};
  }
`

export const CreateNewButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: ${({ theme }) => `${theme.spacing.tiny} ${theme.spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.oppositePrimary};

  svg {
    height: 20px;
    width: 20px;
  }

  &:hover {
  }
`

export const SearchBar = styled.div`
  flex-grow: 1;
  margin: 2rem 0;
  max-width: 800px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  border: 1px solid ${({ theme }) => theme.colors.gray[7]};
  height: 36px;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  input {
    height: 36px;
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    flex-grow: 1;
    color: ${({ theme }) => theme.colors.text.default};
  }
  svg {
    margin: 0 ${({ theme }) => theme.spacing.small};
    flex-shrink: 0;
  }
`

export const UserIcon = styled.div`
  height: 28px;
  width: 28px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  cursor: pointer;
`
