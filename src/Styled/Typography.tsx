import styled from 'styled-components'

export const Title = styled.h1``
export const Subtitle = styled.h2``

export const Para = styled.p``

export const Note = styled.p`
  margin: ${({ theme }) => theme.spacing.small} 0;
  color: ${({ theme }) => theme.colors.text.fade};
`
