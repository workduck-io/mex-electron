import styled, { css } from 'styled-components'
import { CenteredColumn } from './Layouts'

export const IntegrationContainer = styled.section`
  margin-left: 4rem;
`

export const TemplateContainer = styled.section`
  margin-left: 4rem;
`

export const TemplateList = styled.div`
  display: flex;
  align-items: center;
`

export const ServiceName = styled.div`
  font-size: 1rem;
  font-weight: normal;
  font-weight: 600;
  letter-spacing: 1px;
  padding-bottom: 1rem;
`

export const PlusIcon = styled.div`
  padding: 2rem;
  margin-left: ${({ theme }) => theme.spacing.medium};
  width: 10rem;
  height: 10rem;
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.primary};
`

export const Title = styled.h1`
  padding: 2.5rem 1rem;
  font-size: 36px;
  line-height: 44px;
`

export const Services = styled.div`
  display: flex;
  align-items: center;
`

export const ServiceCard = styled.div<{ hover: boolean; disabled: boolean }>`
  position: relative;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background.card};
  margin-left: ${({ theme }) => theme.spacing.medium};
  display: flex;
  width: 10rem;
  height: 12rem;
  flex-direction: column;
  cursor: pointer;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.2rem 0;

  :hover {
    background: ${({ theme }) => theme.colors.background.card};
  }

  ${({ theme, disabled }) =>
    disabled &&
    css`
      pointer-events: none;
      background: ${theme.colors.background.highlight};
      opacity: 0.4;
    `}

  ${({ theme, hover }) =>
    hover
      ? css`
          :hover {
            padding: 0;
            border: 0.2rem solid ${theme.colors.text.heading};
          }
        `
      : css`
           {
            border: 0.2rem solid ${theme.colors.background.highlight};
          }
        `}
`

export const ActiveStatus = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  color: #ffffff;
`

export const RightCut = styled.span`
  position: absolute;
  border-width: 1.5rem;
  border-style: solid;
  top: -1px;
  padding: 0 px;
  right: -1px;
  border-color: ${({ theme }) => theme.colors.background.highlight} ${({ theme }) => theme.colors.background.highlight}
    transparent transparent;
  border-image: initial;
  border-top-right-radius: ${({ theme }) => theme.borderRadius.small};
  margin: 0 px;
`

export const CenteredFlex = styled(CenteredColumn)`
  flex: 1;
`

export const CardTitle = styled.div`
  font-size: 1rem;
  line-height: 1.2rem;
  font-weight: bold;
`

interface MenuTriggerProps {
  selected: boolean
  readOnly: boolean
}

export const IntentMapItem = styled.div`
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.tiny}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  position: relative;
`

// * Not in integration page
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

export const SyncIntentsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  ${MenuTrigger} {
    margin-right: ${({ theme }) => theme.spacing.small};
  }
`
