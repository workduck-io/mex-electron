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
}

export const ActionSelector = styled(Selector)`
  max-width: 40vh;
`

const FormSelector: React.FC<FormSelectorProps> = ({ element, disabled, isMenuAction }) => {
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
    const r = data?.filter((d) => value?.includes(d?.value?.select?.value))
    return r
  }

  const getData = (value: string) => {
    return data?.find((d) => d?.value?.select?.value === value)
  }

  switch (element.type) {
    case FormDataType.SELECT:
      return (
        <Controller
          name={element.key}
          control={control}
          key={element.key}
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
              value={getData(value)}
              onChange={({ value }) => onChange(value?.select?.value)}
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
