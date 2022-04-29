import React, { forwardRef, useEffect, useState } from 'react'

import styled from 'styled-components'
import { components } from 'react-select'
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
  isMulti?: boolean
  width?: string
  actionId: string
  onChange?: any
  placeholder?: string
  error?: any
  actionGroupId: string
}

export const SelectBar = styled(StyledSelect)`
  flex: 1;
  max-width: ${({ width }) => width || '30%'};
  font-size: 0.9rem;
  margin: 0 0.25rem 0 0;
  color: ${({ theme }) => theme.colors.text.default};

  & > div {
    border-radius: ${({ theme }) => theme.borderRadius.small};
    margin: 0.5rem 0 0;
    border: none;
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
// const CustomOption = ({ innerProps, innerRef, isDisabled, data }) => {
//   const label = data?.label

//   mog('CUSTOM OPTION', { data })

//   return !isDisabled ? (
//     <StyledOption ref={innerRef} {...innerProps}>
//       <span>{label}</span>
//     </StyledOption>
//   ) : null
// }

const Selector = forwardRef<any, SelectedProps>((props, ref) => {
  const { actionId, placeholder, onChange, width = '30%', actionGroupId, data, value, isMulti } = props
  const [inputValue, setInputValue] = useState<{ data: Array<any>; value?: any }>({
    data: [],
    value: null
  })

  useEffect(() => {
    setInputValue({ data, value })
  }, [data, value])

  const addSelectionInCache = useActionStore((store) => store.addSelectionInCache)
  const getPreviousActionValue = useActionStore((store) => store.getPrevActionValue)

  const { performer, isPerformer } = useActionPerformer()
  const prevSelelectedLabel = getPreviousActionValue(actionId)?.selection

  const resToDisplay = (result) => {
    return result?.map((item) => {
      const displayItem = item.select
      return {
        label: displayItem?.label,
        value: item
      }
    })
  }

  useEffect(() => {
    const isReady = isPerformer(actionId)

    if (isReady) {
      performer(actionGroupId, actionId).then((res) => {
        const result = res?.contextData
        const data = resToDisplay(result)

        setInputValue({ data, value: null })
      })
    }
  }, [actionId, actionGroupId, prevSelelectedLabel])

  const handleChange = (selection: any) => {
    if (onChange) onChange(selection)
    const val = { prev: prevSelelectedLabel?.label, selection }
    mog('CHANGING', { val })
    addSelectionInCache(actionId, val)
  }

  return (
    <SelectBar
      openMenuOnClick
      menuShouldScrollIntoView
      placeholder={placeholder}
      // components={{ Option: CustomOption }}
      width={width}
      ref={ref}
      error={props.error}
      isMulti={isMulti}
      // autoFocus={isPerformer(actionId)}
      onChange={handleChange}
      value={inputValue.value}
      options={inputValue.data}
    />
  )
})

Selector.displayName = 'Selector'

export default Selector
