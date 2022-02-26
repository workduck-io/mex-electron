import styled, { css } from 'styled-components'

import CreatableSelect from 'react-select/creatable'
import { Draggable } from '../Actions/styled'
import { StyledBackground } from '../styled'

export const StyledInput = styled.input<{ disabled?: boolean }>`
  ${StyledBackground}
  font-size: 1rem;
  border-radius: 10px;
  padding: 10px;

  flex: 1;
  border: none;
  color: ${({ theme, disabled }) => (disabled ? theme.colors.text.disabled : theme.colors.text.fade)};
  ${({ disabled }) =>
    disabled &&
    css`
      font-weight: bolder;
      ::placeholder {
        color: ${({ theme }) => theme.colors.primary};
      }
    `}
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
