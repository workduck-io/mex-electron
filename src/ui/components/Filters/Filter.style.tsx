import styled from 'styled-components'

export const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px solid ${({ theme }) => theme.colors.form.input.border};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray[10]};
`

export const GenericSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
`

export const FilterTypeDiv = styled(GenericSection)``

export const FilterJoinDiv = styled(GenericSection)``

export const FilterValueDiv = styled(GenericSection)`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.form.input.bg};
`

export const FilterRemoveButton = styled(GenericSection)`
  display: flex;
  align-items: center;
`
