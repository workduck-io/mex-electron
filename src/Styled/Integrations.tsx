import { transparentize } from 'polished'
import styled, { css } from 'styled-components'
import { ServiceLabel } from '../Editor/Components/SyncBlock'
import { Card } from './Card'
import { size } from './responsive'
import { Note, Title } from './Typography'

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
  cursor: pointer;

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
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme: { spacing } }) => `${spacing.medium} ${spacing.large}`};

  width: 100%;
  color: ${({ theme }) => theme.colors.text.fade};
  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`

export const TemplatesGrid = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.spacing.medium};

  @media (max-width: ${size.wide}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${size.wide}) {
    grid-template-columns: repeat(4, 1fr);
  }
`

export const SlashCommand = styled.code`
  padding: 0.2em 0.4em;
  margin: ${({ theme }) => theme.spacing.small} 0;
  font-size: 85%;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  border-radius: 6px;
  color: ${({ theme }) => theme.colors.primary};
`

export const SlashCommandPrefix = styled.span`
  color: ${({ theme }) => theme.colors.text.fade};
`

export const Template = styled(Card)`
  cursor: inherit;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.gray[9]};
  ${Title} {
    margin-bottom: 0;
  }
  ${Note} {
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }
  ${ServiceLabel} {
    margin: ${({ theme }) => theme.spacing.small} 0;
  }
`

interface MenuTriggerProps {
  selected: boolean
  readOnly: boolean
}

export const MenuTrigger = styled.div<MenuTriggerProps>`
  display: flex;
  align-items: center;
  width: max-content;
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.medium}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1px dashed ${({ theme }) => theme.colors.form.input.border};
  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
  }

  ${({ readOnly, theme }) =>
    !readOnly &&
    css`
      cursor: pointer;
      &:hover {
        border-color: ${theme.colors.primary};
      }
    `}

  ${({ theme, selected }) =>
    selected &&
    css`
      border: 1px solid transparent;
      background-color: ${theme.colors.gray[8]};
      svg {
        color: ${theme.colors.primary};
      }
    `}
`

export const IntentMapItem = styled.div`
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.tiny}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  position: relative;
`

export const SyncIntentsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  ${MenuTrigger} {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`
