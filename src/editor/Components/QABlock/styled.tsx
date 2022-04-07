import styled from 'styled-components'

export const QuestionInput = styled.div`
  position: relative;

  input {
    :focus + span,
    :not(:focus):valid + span {
      font-size: 0.85rem;
      transform: translate3d(0, -90%, 0);
      opacity: 0.8;
    }
  }

  span {
    position: absolute;
    top: 0;
    padding: 5px 0.25rem;
    transition: ease-in all 200ms;
    pointer-events: none;
    opacity: 0.5;
  }
`
