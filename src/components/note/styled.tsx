import { ThinScrollbar } from '@style/helpers'
import normalize from '@style/spotlight/normalize'
import { transparentize } from 'polished'
import styled, { createGlobalStyle, css } from 'styled-components'

export const NoteWindowLayout = styled.section`
  background: ${({ theme }) => theme.colors.background.app};
  padding: ${({ theme }) => theme.spacing.medium};
`

export const NoteHeaderContainer = styled.div`
  margin: 0.15rem 1rem 0.15rem 7rem;
  display: flex;
  align-items: center;
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
  ${MainFont}
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

      &::-webkit-scrollbar {
        width: 0;
      }
    }
`
