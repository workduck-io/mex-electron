import styled, { css } from 'styled-components'

export const StyledNamespaceTag = styled.div<{ separator?: boolean }>`
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  padding-left: 0.25rem;
  margin-left: 0.5rem;
  ${({ theme, separator }) => separator && css`
    border-left: 1px solid ${theme.colors.text.disabled};
  `
  }
` 
