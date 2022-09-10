import { ThinScrollbar } from '@style/helpers'
import normalize from '@style/spotlight/normalize'
import { lighten, transparentize } from 'polished'
import styled, { createGlobalStyle, css } from 'styled-components'

export const NoteWindowLayout = styled.section`
  background: ${({ theme }) => theme.colors.background.app};
`

export const Draggable = css`
  user-select: none;
  cursor: drag;
  -webkit-user-select: none;
  -webkit-app-region: drag;
`

export const NoteBodyContainer = styled.div`
  padding: 0 1rem 1rem;
`

export const StyledInfoBar = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${({ theme }) => lighten(0.16, theme.colors.palette.red)};
  color: ${({ theme }) => theme.colors.text.heading};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`

export const EditorContainer = styled.div`
  height: 90vh;
  overflow: hidden auto;
`

export const NoteHeaderContainer = styled.div`
  margin: 0.15rem 1rem 0.15rem 6.5rem;
  padding: 1.2rem 0;
  display: flex;
  align-items: center;

  ${Draggable}
`

export const MainFont = css`
  font-size: 14px;
`

export const BodyFont = css`
  font-size: 12px;
`

export const NoteTitle = styled.div`
  margin: 0;
  flex-grow: 1;
  font-size: 1.1rem;
`

export const GlobalNoteStyles = createGlobalStyle`
  ${normalize}

  html, body {
    ${MainFont};
    color: ${({ theme }) => theme.colors.text.default};
    overflow: hidden;
    height: 100vh;
    background-color: ${({ theme }) => transparentize(0.35, theme.colors.background.card)};
    font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  #spotlight {
    height: 100%;
    overflow: hidden;
  }

  button {
    border: none;
  }

  * {
      ${ThinScrollbar};
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 0;
      }
    }
`
