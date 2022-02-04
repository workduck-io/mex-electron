import styled, { css } from 'styled-components'

export const StyledLookup = styled.div`
  padding: 10px;
  display: flex;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.text.heading};
  overflow: hidden;
  flex-direction: column;
`

export const StyledBackground = css`
  background-color: ${({ theme }) => theme.colors.background.modal};
`
