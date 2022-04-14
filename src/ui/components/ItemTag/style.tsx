import styled, { css } from 'styled-components'

export const ItemTagWrapper = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  color: ${({ theme }) => theme.colors.text.fade};
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  svg {
    color: ${({ theme }) => theme.colors.text.default};
  }
  padding: 0.25rem ${({ theme }) => theme.spacing.small};
  font-size: 1rem;
`
