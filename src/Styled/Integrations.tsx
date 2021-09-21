import { transparentize } from 'polished'
import styled from 'styled-components'
import { size } from './responsive'

export const IntegrationsGrid = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.spacing.medium};

  @media (max-width: ${size.wide}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${size.wide}) {
    grid-template-columns: repeat(4, 1fr);
  }
`

interface ServiceButtonProps {
  color: string
  bgColor: string
}

export const ServiceButton = styled.div<ServiceButtonProps>`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.small};

  background: linear-gradient(30deg, ${({ bgColor }) => transparentize(0.2, bgColor)}, ${({ bgColor }) => bgColor});

  border-radius: ${({ theme }) => theme.borderRadius.large};

  color: ${({ color }) => color};

  align-items: center;
`
