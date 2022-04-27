import React from 'react'
import { FormDataType, FormField } from '@workduck-io/action-request-helper'
import Selector from '../Performers/Selector'
import { useActionStore } from '../../Actions/useActionStore'
import ActionInput from './Fields/ActionInput'
import styled from 'styled-components'
import { Controller, useFormContext } from 'react-hook-form'

export type FormSelectorProps = {
  element: FormField
}

export const ActionSelector = styled(Selector)`
  max-width: 40vh;
`

const FormSelector: React.FC<FormSelectorProps> = ({ element }) => {
  const getCacheResult = useActionStore((store) => store.getCacheResult)
  const getSelectionCache = useActionStore((store) => store.getSelectionCache)
  const activeAction = useActionStore((store) => store.activeAction)

  const { control } = useFormContext()

  const context = getCacheResult(element.actionId)
  const selection = getSelectionCache(element.actionId)?.selection

  const data = context?.contextData?.map((res) => {
    const displayItem = res?.select

    return {
      label: displayItem?.label,
      value: res
    }
  })

  const value = selection ?? null

  switch (element.type) {
    case FormDataType.SELECT:
      return (
        <Controller
          name={element.key}
          control={control}
          defaultValue={value}
          key={element.key}
          rules={{
            required: element.options.required
          }}
          render={({ field: { onChange, value } }) => (
            <Selector
              width="100%"
              data={data}
              value={data?.find((d) => d?.value?.select?.value === value)}
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
          defaultValue={value}
          key={element.key}
          rules={{
            required: element.options.required
          }}
          render={({ field: { onChange, value } }) => (
            <ActionInput
              type={element.options.height}
              value={value ?? ''}
              onChange={onChange}
              element={element}
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
          defaultValue={value}
          key={element.key}
          rules={{
            required: element.options.required
          }}
          render={({ field: { ref, onChange, value } }) => (
            <Selector
              isMulti
              data={data}
              value={data?.map((d) => d?.value?.select?.value).includes(value)}
              ref={ref}
              onChange={(changed) => onChange(changed.map((d) => d?.value?.select?.value))}
              width="100%"
              placeholder={element.options.placeholder}
              actionGroupId={activeAction?.actionGroupId}
              actionId={element.actionId}
            />
          )}
        />
      )
    default:
      return <div>Hello </div>
  }
}

export default FormSelector
