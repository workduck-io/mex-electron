import React, { useEffect, useMemo } from 'react'
import { FormData } from '@workduck-io/action-request-helper'
import { ActionSubType, useActionStore } from '../../Actions/useActionStore'
import ActionFormElement from './Fields/ActionFormElement'
import FormSelector from './FormSelector'
import { groupBy } from 'lodash'
import { ActionRow, StyledActionFormContainer } from './styled'
import styled from 'styled-components'
import { FormProvider, useForm } from 'react-hook-form'
import { useActionPerformer } from '../../Actions/useActionPerformer'
import tinykeys from 'tinykeys'

export type ActionFormProps = {
  actionId: string
  actionGroupId: string
  subType: ActionSubType
}

const groupRows = (data: FormData) => {
  return groupBy(data, (n) => n.options.row)
}

type ActionRowRendererProps = {
  row: FormData
}

const ActionRowRenderer: React.FC<ActionRowRendererProps> = ({ row }) => {
  return (
    <ActionRow isRow={true}>
      {row.map((element) => (
        <ActionFormElement
          required={element.options.required}
          key={element.key}
          flex={element.options.flex}
          label={element.label}
        >
          <FormSelector element={element} />
        </ActionFormElement>
      ))}
    </ActionRow>
  )
}

const UniAction = styled.div`
  width: 100%;
  overflow: hidden;
`

const ActionForm: React.FC<ActionFormProps> = ({ subType, actionId, actionGroupId }) => {
  const groupedActions = useActionStore((store) => store.groupedActions)
  const setIsSubmitting = useActionStore((store) => store.setIsSubmitting)

  const formMethods = useForm()
  const { performer } = useActionPerformer()

  const form = useMemo(() => {
    const config = groupedActions?.[actionGroupId]?.[actionId]
    const groups = groupRows(config?.form ?? [])
    return groups
  }, [actionGroupId, actionId])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Enter': (event) => {
        event.preventDefault()

        formMethods.handleSubmit(onSubmit)()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [formMethods.formState])

  if (!subType || subType === 'none') return <></>

  const onSubmit = async (form: any) => {
    setIsSubmitting(true)
    await performer(actionGroupId, actionId, { formData: form })
    setIsSubmitting(false)
  }

  return (
    <UniAction>
      <FormProvider {...formMethods}>
        <StyledActionFormContainer id="action-form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          {Object.values(form).map((row, index) => {
            return <ActionRowRenderer key={index} row={row} />
          })}
        </StyledActionFormContainer>
      </FormProvider>
    </UniAction>
  )
}

export default ActionForm
