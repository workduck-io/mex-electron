import { StyledBackground } from '@components/spotlight/styled'
import { StyledSelect } from '@style/Form'
import styled from 'styled-components'

export const Dropdown = styled.div`
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

export const SelectBar = styled(StyledSelect)`
  flex: 1;
  max-width: max(${({ width }) => width || '30%'}, 14rem);
  font-size: 0.9rem;
  margin: 0 0.25rem 0 0;
  color: ${({ theme }) => theme.colors.text.default};

  & > div {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    margin: 0.5rem 0 0;
    border: 1px solid ${({ theme }) => theme.colors.background.app};
  }
`

export const StyledOption = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;

  span {
    margin-right: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img {
    border-radius: 50%;
    padding: 2px;
    background-color: ${({ theme }) => theme.colors.background.card};
  }

  div {
    margin: 0;
  }

  font-size: 0.9rem;
`
