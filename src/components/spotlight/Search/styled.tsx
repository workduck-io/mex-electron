import styled, { css } from 'styled-components'

import CreatableSelect from 'react-select/creatable'
import { Draggable } from '../Actions/styled'
import { StyledBackground } from '../styled'

export const Before = styled.div<{ before: string }>`
  width: 100%;
  display: flex;
  align-items: center;
  ${({ before }) =>
    before &&
    css`
      ::before {
        content: '${before}';
        padding: 0.3rem 10px;
        margin-left: 0.5rem;
        border-radius: 10px;
        background-color: ${({ theme }) => theme.colors.background.highlight};
        color: ${({ theme }) => theme.colors.text.default};
        font-size: 0.8rem;
        font-weight: 500;
      }
    `}
`

export const StyledInput = styled.input<{ disabled?: boolean; before?: string }>`
  ${StyledBackground}
  font-size: 1rem;
  border-radius: 10px;
  padding: 10px;

  flex: 1;
  border: none;
  color: ${({ theme }) => theme.colors.form.input.fg};

  ${({ disabled }) =>
    disabled &&
    css`
      font-weight: bolder;
      ::placeholder {
        color: ${({ theme }) => theme.colors.primary};
      }
    `}

  ::placeholder {
    color: ${({ theme }) => theme.colors.gray[4]};
    opacity: 0.5rem;
  }

  :focus {
    outline: none;
  }
`

export const StyledCreateInput = styled(CreatableSelect)`
  ${StyledBackground}
  font-size: 1rem;
  border-radius: 10px;
  flex: 1;
  border: none;
  color: ${({ theme }) => theme.colors.text.fade};
  :focus {
    outline: none;
  }
`

export const StyledSearch = styled.section`
  ${Draggable}
  ${StyledBackground}
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`
