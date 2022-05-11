import { SelectWrapper } from '@style/Form'
import { Title } from '@style/Typography'
import { transparentize } from 'polished'
import styled from 'styled-components'

export const InviteWrapper = styled.div``
export const InviteFormWrapper = styled.form``
export const SharedPermissionsWrapper = styled.div`
  ${InviteWrapper} {
    ${Title} {
      display: none;
    }

    form {
      display: flex;
      align-items: center;
      gap: ${({ theme }) => theme.spacing.small};

      ${SelectWrapper} {
        width: 60%;
      }
    }
  }
`

export const SharedPermissionsTable = styled.table`
  margin-top: ${({ theme }) => theme.spacing.large};
  min-width: 600px;
  border: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  caption {
    padding: ${({ theme }) => theme.spacing.small};
  }
`

export const ShareRow = styled.tr``
export const ShareRowHeading = styled.thead`
  tr {
    border-bottom: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[8])};
    td {
      padding: ${({ theme }) => theme.spacing.small};
    }
  }
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`

export const ShareAlias = styled.td`
  font-weight: bold;
  padding: ${({ theme }) => theme.spacing.small};
`
export const ShareEmail = styled.td`
  padding: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.fade};
`
export const SharePermission = styled.td`
  width: 120px;
`
export const ShareRemove = styled.td`
  width: 48px;
`
