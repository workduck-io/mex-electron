import styled from 'styled-components'
import { focusStyles } from './focus'
import { FocusModeProp } from './props'
import { size } from './responsive'

interface InfoBarWrapperProps extends FocusModeProp {
  wide: string
}

export const InfoBarWrapper = styled.div<InfoBarWrapperProps>`
  overflow-x: hidden;
  height: 100vh;

  @media (max-width: ${size.wide}) {
    min-width: ${({ wide }) => {
      const mainWidth = wide === 'true' ? '600px' : '300px'
      return `calc(${mainWidth})`
    }};
    max-width: ${({ wide }) => {
      const mainWidth = wide === 'true' ? '600px' : '300px'
      return `calc(${mainWidth})`
    }};
  }
  @media (min-width: ${size.wide}) {
    min-width: ${({ wide }) => {
      const mainWidth = wide === 'true' ? '800px' : '300px'
      return `calc(${mainWidth})`
    }};
    max-width: ${({ wide }) => {
      const mainWidth = wide === 'true' ? '800px' : '300px'
      return `calc(${mainWidth})`
    }};
  }
  transition: opacity 0.3s ease-in-out;
  ${focusStyles}
`

export const TemplateInfoBar = styled(InfoBarWrapper)`
  /* overflow-y: scroll; */
  height: 100%;
`

export const InfoWidgetWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const InfoWidgetScroll = styled.div`
  overflow-y: auto;
  max-height: 20vh;
`

export const InfobarFull = styled.div`
  max-height: 100vh;
  width: 100%;
  position: relative;
  min-width: 600px;
  * {
    outline: none;
    outline-style: none;
  }
`

export const InfobarTools = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({ theme: { spacing } }) => `${spacing.large} ${spacing.medium}`};
  margin-top: 2rem;

  background-color: ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  label {
    flex-grow: 1;
    text-align: center;
  }
`
