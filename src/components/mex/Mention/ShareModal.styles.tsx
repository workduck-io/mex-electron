import { SelectWrapper } from '@style/Form'
import { Title } from '@style/Typography'
import { Button } from '@workduck-io/mex-components'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

export const InviteWrapper = styled.div``
export const MultipleInviteWrapper = styled.div`
  form > fieldset {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.small};
    flex-wrap: wrap;
    max-width: 600px;
    ${SelectWrapper}:nth-of-type(2) {
      width: 60%;
    }
  }
`
export const InviteFormWrapper = styled.form``
export const InviteFormFieldset = styled.fieldset`
  border: none;
  padding: 0;
`
export const SharedPermissionsWrapper = styled.div``

export const SharedPermissionsTable = styled.table`
  min-width: 600px;
  width: 100%;
  border: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  caption {
    text-align: left;
    padding: 0 0 ${({ theme }) => theme.spacing.medium} 0;
  }
`

export const ShareRow = styled.tr<{ hasChanged?: boolean; isRevoked?: boolean }>`
  ${({ isRevoked }) =>
    isRevoked &&
    css`
      opacity: 0.5;
      text-decoration: line-through;
    `}
`

export const ShareRowHeading = styled.thead`
  tr {
    border-bottom: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
    td {
      padding: ${({ theme }) => theme.spacing.small};
      &:first-child {
        padding-left: ${({ theme }) => theme.spacing.medium};
      }
    }
  }
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`

export const ShareAlias = styled.td<{ hasChanged?: boolean }>`
  border-left: 2px solid transparent;
  ${({ theme, hasChanged }) =>
    hasChanged &&
    css`
      border-left: 2px solid ${theme.colors.primary};
    `}
`

export const ShareAliasWithImage = styled.td`
  padding: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  svg,
  img {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  font-weight: 500;
`

export const ShareOwnerTag = styled.div`
  padding: ${({ theme }) => `0.75rem ${theme.spacing.small}`};
  color: ${({ theme }) => theme.colors.text.default};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background: ${({ theme }) => theme.colors.gray[8]};
  border: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
`

export const ShareAliasInput = styled.input`
  background: ${({ theme }) => transparentize(0.75, theme.colors.gray[8])};
  border: none;
  color: ${({ theme }) => theme.colors.text.heading};
  padding: ${({ theme }) => theme.spacing.small};
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  &:hover {
  }

  &:focus {
    background: ${({ theme }) => transparentize(0.1, theme.colors.gray[9])};
  }
`

export const ShareEmail = styled.td`
  max-width: 20rem;
  padding: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.fade};
`

export const SharePermission = styled.td<{ disabled?: boolean }>`
  width: 120px;

  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
    `}
`

export const ShareRowActionsWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  ${Button} {
    height: 100%;
  }
`
export const ShareRowAction = styled.td``
