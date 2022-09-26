import { EditorStyles } from '@style/Editor'
import styled from 'styled-components'

export const PreviewNoteContainer = styled.section`
  width: 50vw;
  max-width: 50vw;

  ${EditorStyles} {
    background: ${({ theme }) => theme.colors.background.app};
  }
`
