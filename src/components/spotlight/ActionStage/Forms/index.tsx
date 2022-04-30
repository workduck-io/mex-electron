import React, { useEffect, useMemo } from 'react'
import { FormData } from '@workduck-io/action-request-helper'
import { ActionSubType, useActionStore } from '../../Actions/useActionStore'
import ActionFormElement from './Fields/ActionFormElement'
import FormSelector from './FormSelector'
import { groupBy, set } from 'lodash'
import { ActionRow, StyledActionFormContainer } from './styled'
import styled from 'styled-components'
import { FormProvider, useForm } from 'react-hook-form'
import { useActionPerformer } from '../../Actions/useActionPerformer'
import tinykeys from 'tinykeys'
import { mog } from '../../../../utils/lib/helper'

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
  disabled?: boolean
}

const ActionRowRenderer: React.FC<ActionRowRendererProps> = ({ row, disabled }) => {
  return (
    <ActionRow isRow={true}>
      {row.map((element) => (
        <ActionFormElement
          required={element.options.required}
          key={element.key}
          flex={element.options.flex}
          label={element.label}
        >
          <FormSelector element={element} disabled={disabled} />
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
  const activeAction = useActionStore((store) => store.activeAction)
  const getPrevActionValue = useActionStore((store) => store.getPrevActionValue)

  const prev = getPrevActionValue(actionId)
  const disabled = !prev && !!activeAction?.actionIds

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
        event.stopPropagation()

        formMethods.handleSubmit(onSubmit)()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [formMethods.formState])

  if (!subType || subType === 'none') return <></>

  const withFooter = (form: any) => {
    const newForm = {}
    const config = groupedActions?.[actionGroupId]?.[actionId]
    const configForm = config?.form ?? []

    configForm.forEach((field) => {
      const suffix = field?.options?.appendValue
      const value = formMethods?.getValues(field.key)

      if (field.key && value) {
        if (suffix) {
          if (typeof value === 'string') {
            const footerDescription = value + '\n' + suffix
            set(newForm, field.key, footerDescription)
          }
        } else {
          // * Null check
          set(newForm, field.key, value)
        }
      }
    })

    return newForm
  }

  const onSubmit = async (form: any) => {
    setIsSubmitting(true)
    const updatedForm = withFooter(form)
    mog('FORM IS ', { updatedForm, form })
    await performer(actionGroupId, actionId, { formData: updatedForm })
    setIsSubmitting(false)
  }

  return (
    <UniAction>
      <FormProvider {...formMethods}>
        <StyledActionFormContainer id="action-form" onSubmit={formMethods.handleSubmit(onSubmit)}>
          {Object.values(form).map((row, index) => {
            return <ActionRowRenderer key={index} row={row} disabled={disabled} />
          })}
        </StyledActionFormContainer>
      </FormProvider>
    </UniAction>
  )
}

export default ActionForm
