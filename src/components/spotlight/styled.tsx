import styled, { css } from 'styled-components'

export const StyledLookup = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.text.heading};
  overflow: hidden;
`

export const StyledBackground = css`
  background-color: ${({ theme }) => theme.colors.background.modal};
`
