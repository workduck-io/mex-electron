import styled from 'styled-components'

export const StyledTable = styled.table`
  margin: ${({ theme }) => theme.spacing.medium};

  border-collapse: collapse;
  min-width: 600px;
  border: 1px solid ${({ theme }) => theme.colors.gray[8]};

  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
`

export const StyledTHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray[8]};
`

export const StyledRow = styled.tr``

export const StyledTH = styled.th`
  padding: ${({ theme }) => theme.spacing.small};
  text-align: left;
`

export const StyledTBody = styled.tbody``

export const StyledTD = styled.td`
  padding: ${({ theme }) => theme.spacing.small};
`

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
