import { transparentize } from 'polished'
import styled from 'styled-components'

export const Input = styled.input`
  height: 0;
  width: 0;
  opacity: 0;
  z-index: -1;
`

export const Label = styled.label<{ size: string; disabled: boolean }>`
  position: relative;
  display: inline-block;
  font-size: ${(props) => {
    if (props.size === 'xs') return '6px'
    if (props.size === 'sm') return '8px'
    if (props.size === 'lg') return '12px'

    return '10px'
  }};
  width: 6em;
  height: 3.4em;

  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  ${Input} {
    opacity: 0;
    width: 0;
    height: 0;
  }
`

export const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[10])};
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 3.4em;

  &::before {
    position: absolute;
    content: '';
    height: 2.6em;
    width: 2.6em;
    left: 0.4em;
    bottom: 0.4em;
    background-color: ${({ theme }) => theme.colors.background.highlight};
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  ${Input}:checked + & {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  ${Input}:checked + &::before {
    -webkit-transform: translateX(2.6em);
    -ms-transform: translateX(2.6em);
    transform: translateX(2.6em);
  }

  ${Input}:focus + & {
    box-shadow: 0 0 0.1em ${({ theme }) => theme.colors.background.highlight};
  }

  ${Input}:disabled + & {
    pointer-events: none;
    background: ${({ theme }) => theme.colors.text.disabled};
  }
`
