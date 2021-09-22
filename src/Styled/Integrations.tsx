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

export const ServiceIconWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.large};
`

export const ServiceButton = styled.div<ServiceButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;

  h1 {
    margin: ${({ theme }) => theme.spacing.medium} 0 0;
  }

  ${ServiceIconWrapper} {
    width: 100%;
    background: linear-gradient(-30deg, ${({ bgColor }) => transparentize(0.3, bgColor)}, ${({ bgColor }) => bgColor});
    color: ${({ color }) => color};
    text-align: center;
  }
`

export const ServiceButtonFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme: { spacing } }) => `${spacing.medium} ${spacing.large}`};

  width: 100%;
  color: ${({ theme }) => theme.colors.text.fade};
  p {
    margin: 0;
  }
`
