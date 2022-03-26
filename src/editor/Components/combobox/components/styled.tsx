import styled from 'styled-components'
import { Button } from '../../../../style/Buttons'
import { ComboboxItem } from '../../tag/components/TagCombobox.styles'

export const ComboSeperator = styled.div`
  margin-left: 0.5rem;

  /* section {
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
  } */
  width: 300px;
`

export const StyledComboHeader = styled(ComboboxItem)`
  padding: 0.2rem 0;
  margin: 0.25rem 0;

  ${Button} {
    padding: 0.25rem;
    margin: 0 0.5rem 0;
  }
`

export const ComboboxShortcuts = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  /* margin-top: 1rem; */
  padding: 0.5rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[8]};
`
