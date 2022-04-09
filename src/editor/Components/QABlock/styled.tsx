import styled from 'styled-components'

export const QuestionInput = styled.div<{ highlight?: boolean }>`
  position: relative;
  margin: 0.25rem 0;

  input {
    background: none;
    color: ${({ theme }) => theme.colors.text.default};
    :focus + span,
    :not(:focus):valid + span {
      font-size: 0.85rem;
      padding: 1px 0;
      color: ${({ theme }) => theme.colors.text.fade};
      opacity: 0.9;
      transform: translate3d(0, -90%, 0);
    }
  }

  span {
    position: absolute;
    display: flex;
    align-items: center;
    /* color: opacify(0.9, ${({ theme }) => theme.colors.text.fade}); */
    opacity: 0.4;

    top: 0;
    padding: 5px 0.5rem;
    transition: ease-in all 200ms;
    pointer-events: none;
  }
`
