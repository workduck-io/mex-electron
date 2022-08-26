import styled from 'styled-components'

export const TemplateContainer = styled.div`
  display: flex;
  max-height: 350px;
  margin: 1rem -0.5rem;

  & > section {
    height: 30vh !important;
    width: 300px;
    overflow-y: auto;
    overflow-x: hidden;
  }
`
