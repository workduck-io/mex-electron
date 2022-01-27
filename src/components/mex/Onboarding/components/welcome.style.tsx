import { StyledKey } from "../../../spotlight/Shortcuts/styled"
import styled, { keyframes } from "styled-components"

export const WelcomeHeader = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 0.5rem; ;
`

export const Height = styled.section`
  display: flex;
  flex-direction: column;
`

export const StyledKeyCap = styled(StyledKey)`
  padding: 4px 8px;
  font-size: 0.8rem;
`

export const StyledTypography = styled.div<{ margin: string; maxWidth: string; color: string; size: string }>`
  margin: ${({ margin }) => margin};
  max-width: ${({ maxWidth }) => maxWidth};
  color: ${({ color }) => color};
  font-size: ${({ size }) => size};
`

const waveAnimation = keyframes`
  0% { transform: rotate(0.0deg) }
  10% { transform: rotate(12.0deg) }
  20% { transform: rotate(-7.0deg) }
  30% { transform: rotate(12.0deg) }
  40% { transform: rotate(-3.0deg) }
  50% { transform: rotate(9.0deg) }
  60% { transform: rotate(0.0deg) }
  100% { transform: rotate(0.0deg) }
`

export const Wave = styled.span`
  display: inline-block;
  animation: ${waveAnimation} 2.5s infinite;
  transform-origin: 70% 70%;
`


