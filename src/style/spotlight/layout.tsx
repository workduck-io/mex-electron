import styled, { css } from 'styled-components'

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Centered = styled(Center)`
  width: 100%;
  height: 100%;
`

export const CenterIcon = styled(Center)<{ pointer?: boolean }>`
  ${({ pointer }) =>
    pointer &&
    css`
      cursor: pointer;
    `}
  height: 100%;
  color: #888;
  padding-left: 8px;
`

export const Scroll = css`
  overflow-y: scroll;
  overflow-x: hidden;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`
