import styled from 'styled-components'

export const FlexGap = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing.small};
`

export const Margin = styled.div<{ margin: string }>`
  margin: ${(props) => props.margin};
`
