import styled, { css } from 'styled-components'

export const SpotlightContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.text.heading};
`

export const StyledBackground = css`
  background-color: ${({ theme }) => theme.colors.background.app};
`
