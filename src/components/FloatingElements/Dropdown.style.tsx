import styled, { css } from 'styled-components'

const MenuItemStyles = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  text-align: left;
  line-height: 1.5;
  min-width: 110px;
  margin: 0;
  outline: 0;
  color: ${({ theme }) => theme.colors.text.default};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};

  &.open {
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  &:focus,
  &:not([disabled]):active {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
`

export const RootMenuWrapper = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border: none;
  background: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.default};

  &.MenuItem {
    ${MenuItemStyles}
  }

  &.open,
  &:hover {
    background: ${({ theme }) => theme.colors.gray[7]};
  }
`

export const MenuWrapper = styled.div`
  background: ${({ theme }) => theme.colors.gray[9]};
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.colors.gray[8]};
  border-radius: 6px;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.1);
  outline: 0;
  max-height: 300px;
  overflow-y: auto;
`

export const MenuItemWrapper = styled.button`
  ${MenuItemStyles}
`
