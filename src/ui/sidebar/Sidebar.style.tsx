import { LoadingButton } from '@workduck-io/mex-components'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

export const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.small};
`

export const SpaceWrapper = styled(SidebarWrapper)`
  gap: ${({ theme }) => theme.spacing.medium};
`

export const SingleSpace = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: calc(100% - 4rem);
  gap: ${({ theme }) => theme.spacing.large};
`

export const SpaceHeader = styled.div`
  display: flex;
  flex-direction: column;

  gap: ${({ theme }) => theme.spacing.small};

  width: 100%;
`

export const SpaceTitleWrapper = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding-left: ${({ theme }) => theme.spacing.small};
`

export const SpaceTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const SidebarToggle = styled.div<{ isVisible?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  :hover {
    color: ${({ theme }) => theme.colors.text.heading};
    background-color: ${({ theme }) => theme.colors.gray[8]};
  }

  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};

  svg {
    height: 16px;
    width: 16px;
  }
`

export const PinnedList = styled.div`
  display: flex;
  flex-direction: column;
`

export const MexTreeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 0%;
  gap: ${({ theme }) => theme.spacing.small};
`

export const SpaceList = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`

export const SpaceSwitcher = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
`

export const SwitcherSpaceItems = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
`

export const SpaceItem = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  color: ${({ theme }) => theme.colors.gray[6]};
  ${({ theme, active }) =>
    active &&
    css`
      color: ${theme.colors.text.heading};
    `}

  :hover {
    background-color: ${({ theme }) => theme.colors.gray[8]};
  }

  svg {
    height: 24px;
    width: 24px;
  }
`
export const CreateNewButton = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  svg {
    height: 24px;
    width: 24px;
  }
`

export const PinNoteButton = styled(LoadingButton)`
  background: ${({ theme }) => transparentize(0.75, theme.colors.gray[9])};
  border: 1px dashed ${({ theme }) => theme.colors.gray[8]};
  padding: 0.5rem;
  justify-content: flex-start;
  box-shadow: none;
  color: ${({ theme }) => theme.colors.text.fade};

  &:hover,
  &:focus,
  &:active {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => transparentize(0.75, theme.colors.gray[9])};
    border: 1px dashed ${({ theme }) => theme.colors.primary};
  }

  svg {
    height: 16px;
    width: 16px;
  }
`
