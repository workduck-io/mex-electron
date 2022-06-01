import styled from 'styled-components'

export const StyledActionFormContainer = styled.form`
  height: fit-content;
  width: 100%;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
`

export const ActionRow = styled.div<{ isRow?: boolean }>`
  display: flex;
  margin: ${({ theme }) => theme.spacing.tiny};
  align-items: center;
  gap: 0 1rem;
  min-width: 70%;
  max-width: 70%;
`
