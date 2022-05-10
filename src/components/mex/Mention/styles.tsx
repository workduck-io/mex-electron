import styled from 'styled-components'

export const SharedPermissionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`

export const ShareRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
