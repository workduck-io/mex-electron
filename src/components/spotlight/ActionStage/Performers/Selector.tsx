import React, { useEffect, useState } from 'react'

import styled from 'styled-components'
import { StyledSelect } from '../../../../style/Form'
import { mog } from '../../../../utils/lib/helper'
import { useActionPerformer } from '../../Actions/useActionPerformer'
import { useActionStore } from '../../Actions/useActionStore'
import { StyledBackground } from '../../styled'

const Dropdown = styled.div`
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

type SelectedProps = {
  value?: any
  data?: any
  actionId: string
  actionGroupId: string
}

export const SelectBar = styled(StyledSelect)`
  flex: 1;
  max-width: 30%;
  font-size: 0.9rem;
  margin: 0 0.25rem;
  color: ${({ theme }) => theme.colors.text.default};
  & > div {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    margin: 0.5rem 0 0;
  }
`

const StyledOption = styled.div`
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.background.card};
    color: ${({ theme }) => theme.colors.text.default};
  }

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
    margin-right: 4px;
  }

  div {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.gray[5]};
  }
`

// eslint-disable-next-line react/prop-types

// * Custom Option for Selector component
// const CustomOption = ({ innerProps, isDisabled, data }) => {
//   const sub = data?.value?.display?.sub
//   const label = data?.label

//   return !isDisabled ? (
//     <StyledOption {...innerProps}>
//       <span>{label}</span>
//       {sub && <div>{sub}</div>}
//     </StyledOption>
//   ) : null
// }

const Selector: React.FC<SelectedProps> = ({ actionId, actionGroupId, data, value }) => {
  const [inputValue, setInputValue] = useState<{ data: Array<any>; value?: any }>({
    data: [],
    value: null
  })

  useEffect(() => {
    setInputValue({ data, value })
  }, [data, value])

  const actionToPerform = useActionStore((store) => store.actionToPerform)
  const updateValueInCache = useActionStore((store) => store.updateValueInCache)
  const selectedValue = useActionStore((store) => store.selectedValue)

  const { performer, isPerformer } = useActionPerformer()

  useEffect(() => {
    const at = isPerformer(actionId)

    if (at) {
      performer(actionGroupId, actionId).then((res) => {
        const result = res?.contextData

        const data = result?.map((item) => {
          const displayItem = item.select
          return {
            label: displayItem.value,
            value: item
          }
        })
        setInputValue({ data, value: null })
      })
    }
  }, [actionId, actionGroupId, actionToPerform, selectedValue])

  const handleChange = (selected: any) => {
    updateValueInCache(actionId, selected)
  }

  return (
    <SelectBar
      autoFocus={isPerformer(actionId)}
      onChange={handleChange}
      value={inputValue.value}
      options={inputValue.data}
    />
  )
}

export default Selector
