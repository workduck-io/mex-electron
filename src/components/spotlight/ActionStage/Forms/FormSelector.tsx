import React from 'react'
import { FormDataType, FormField } from '@workduck-io/action-request-helper'
import Selector from '../Performers/Selector'
import { useActionStore } from '../../Actions/useActionStore'
import ActionInput from './Fields/ActionInput'
import styled from 'styled-components'
import { Controller, useFormContext } from 'react-hook-form'
import { mog } from '@utils/lib/helper'

export type FormSelectorProps = {
  element: FormField
  disabled?: boolean
  isMenuAction?: boolean
  saveSelected?: boolean
  defaultValue?: any
}

export const ActionSelector = styled(Selector)`
  max-width: 40vh;
`

const FormSelector: React.FC<FormSelectorProps> = ({ element, disabled, isMenuAction, defaultValue, saveSelected }) => {
  const getCacheResult = useActionStore((store) => store.getCacheResult)
  const activeAction = useActionStore((store) => store.activeAction)

  const { control } = useFormContext()

  const context = getCacheResult(element.actionId)

  const data = context?.contextData?.map((res) => {
    const displayItem = res?.select

    return {
      label: displayItem?.label,
      value: res
    }
  })

  const filterTags = (value) => {
    const result = data?.filter((d) => value?.includes(d?.value?.select?.value))
    return result
  }

  const getData = (selectedValue: any) => {
    const toMatch = saveSelected ? selectedValue?.value?.value : selectedValue

    const result = data?.find((d) => d?.value?.select?.value === toMatch)

    if (!result) return selectedValue

    return result
  }

  switch (element.type) {
    case FormDataType.SELECT:
      return (
        <Controller
          name={element.key}
          control={control}
          key={element.key}
          defaultValue={defaultValue}
          rules={{
            required: element.options.required
          }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <Selector
              width="100%"
              error={error}
              data={data}
              isList={isMenuAction}
              disabled={disabled}
              defaultValue={defaultValue}
              cacheSelection={!isMenuAction}
              value={getData(value)}
              onChange={({ value }) => {
                mog(' value of something is here', { value })

                return onChange(saveSelected ? value?.select : value?.select?.value)
              }}
              placeholder={element.options.placeholder}
              actionGroupId={activeAction?.actionGroupId}
              actionId={element.actionId}
            />
          )}
        />
      )
    case FormDataType.TEXT:
      return (
        <Controller
          name={element.key}
          control={control}
          key={element.key}
          defaultValue={defaultValue}
          rules={{
            required: element.options.required
          }}
          render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
            <ActionInput
              type={element.options.height}
              value={value ?? ''}
              onChange={onChange}
              error={error}
              disabled={disabled}
              element={element}
              ref={ref}
              actionGroupId={activeAction?.actionGroupId}
              actionId={element.actionId}
            />
          )}
        />
      )

    case FormDataType.MULTI_SELECT:
      return (
        <Controller
          name={element.key}
          control={control}
          defaultValue={defaultValue}
          key={element.key}
          rules={{
            required: element.options.required
          }}
          render={({ field: { ref, onChange, value }, fieldState: { error } }) => (
            <Selector
              isMulti
              data={data}
              error={error}
              disabled={disabled}
              isList={isMenuAction}
              value={filterTags(value)}
              cacheSelection={!isMenuAction}
              ref={ref}
              onChange={(newVal) => {
                const isArray = Array.isArray(newVal)

                if (isArray) {
                  onChange(newVal?.map((d) => d?.value?.select?.value))
                  return
                }
                const val = newVal?.value?.select?.value
                if (value) {
                  const isPresent = value?.find((d) => d === val)
                  isPresent ? onChange(value?.filter((d) => d !== val)) : onChange([...value, val])
                } else {
                  onChange([val])
                }
              }}
              width="100%"
              placeholder={element.options.placeholder}
              actionGroupId={activeAction?.actionGroupId}
              actionId={element.actionId}
            />
          )}
        />
      )
    default:
      return <></>
  }
}

export default FormSelector
