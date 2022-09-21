import { InfobarTools } from '@style/infobar'
import styled, { css } from 'styled-components'
import { Container, Content } from './NodePreview'

export const StyledGraph = styled.div`
  max-height: 100vh;
  width: 100%;
  position: relative;
  * {
    outline: none;
    outline-style: none;
  }
`
export const StyledSyncBlockInfo = styled(StyledGraph)`
  overflow-y: auto;
`

export const GraphWrapper = styled.div<{ fullscreen?: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.small};
  height: calc(100vh - 15.5rem);

  ${({ fullscreen }) =>
    fullscreen &&
    css`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 20;
      width: 100%;
      height: 100%;
      margin-top: 0;
      ${InfobarTools} {
        position: fixed;
        top: ${({ theme }) => theme.spacing.large};
        right: 0;
        margin: 0 auto;
        width: 25vw;
        z-index: 25;
      }
      ${Container} {
        width: 25vw;
        height: 93%;
        z-index: 200;
        top: 6rem;
        right: 0;
        ${Content} {
          height: 100%;
        }
      }
    `}

  .node-label {
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 4px;
    user-select: none;
  }
`
