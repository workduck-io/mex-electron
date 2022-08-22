import { EditorStyles } from '@style/Editor'
import styled from 'styled-components'

export const TaskEditorWrapper = styled.section`
  padding: ${({ theme }) => theme.spacing.small};
`

export const TaskEditorStyle = styled(EditorStyles)`
  min-width: 40vw;
  max-width: 40vw;
  max-height: 50vh;
  background: #333;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.small};
  margin: ${({ theme }) => theme.spacing.medium};
`
