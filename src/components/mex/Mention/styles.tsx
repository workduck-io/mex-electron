import styled from 'styled-components'

export const SharedPermissionsWrapper = styled.table`
  min-width: 600px;
`

export const ShareRow = styled.tr``

export const ShareAlias = styled.td``
export const ShareEmail = styled.td`
  color: ${({ theme }) => theme.colors.text.fade};
`
export const SharePermission = styled.td`
  width: 120px;
`
export const ShareRemove = styled.td`
  width: 48px;
`
