import styled from 'styled-components'

export const StyledReleaseNoteWrapper = styled.section`
  height: 75vh;
  width: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ReleaseNote = styled.iframe`
  width: 100%;
  height: 100%;

  border-radius: ${({ theme }) => theme.borderRadius.small};
`
