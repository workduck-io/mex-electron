import { FlexBetween } from '@components/spotlight/Actions/styled'
import { Description } from '@components/spotlight/SearchResults/styled'
import { CenteredMainContent } from '@style/Editor'
import { CardShadow } from '@style/helpers'
import { CenteredFlex, Title } from '@style/Integration'
import { Button } from '@workduck-io/mex-components'
import styled, { css } from 'styled-components'
import { CardStyles } from '../Settings/Importers'

export const ServiceContainer = styled(CenteredMainContent)``

export const GroupHeaderContainer = styled.section`
  ${CardStyles}
  ${CardShadow}
  position: relative;

  margin-top: 1rem;
  user-select: none;

  & > div {
    display: flex;
    padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};
    gap: ${({ theme }) => theme.spacing.medium};
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    justify-content: space-evenly;
  }

  height: fit-content;
`

export const ServiceDescription = styled.p`
  margin: 0 1rem 0 0;
  font-size: 1rem;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.default};
`

export const ActionGroupIcon = styled(CenteredFlex)`
  margin: 0 1rem;

  ${Button} {
    width: 100%;
  }

  & > span {
    padding: 1rem 2rem;
    margin: 1rem 0 2rem;
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

export const GroupHeader = styled.div<{ connected?: boolean }>`
  ${Title} {
    padding: 0;
    font-size: 2.5rem;
  }

  ${FlexBetween} {
    padding-right: 1rem;
  }

  ${Button} {
    padding: 0.5rem 0.75rem;
    ${({ connected, theme }) =>
      connected &&
      css`
        background: transparentize(0.6, theme.colors.background.app);
        color: theme.colors.text.heading;
        cursor: default;
        :hover {
          box-shadow: none;
        }
      `}
  }
`

export const FloatingIcon = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
`

export const ActionsContainer = styled.section`
  padding: ${({ theme }) => theme.spacing.large};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[7]};
  width: 100%;
  overflow: hidden auto;
  max-height: 60vh;

  & > header {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.colors.text.fade};
    font-weight: 700;
    padding: 1rem 0.5rem 1.5rem;
  }
`

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
  padding: 0.75rem ${({ theme }) => theme.spacing.small};

  /* border-radius: ${({ theme }) => theme.borderRadius.small}; */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[7]};

  ${ActionGroupIcon} {
    flex: none;
    width: auto;
  }

  section {
    padding: 0 ${({ theme }) => theme.spacing.small};
  }

  h4 {
    margin: 0;
    font-size: medium;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.text.default};
  }

  ${Description} {
    font-size: 0.8rem;
  }
`

export const GoogleCalendarUserCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  justify-content: space-between;
  width: max-content;
  margin: 0 auto;

  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.large}`};
  background: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`

export const GoogleCalendarUserAvatar = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
`

export const GoogleCalendarUserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.default};
  font-size: 1rem;
`

export const GoogleCalendarUserName = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`
