import React, { useMemo, useState } from 'react'
import { actionPerformer, useActionPerformer } from '@components/spotlight/Actions/useActionPerformer'
import { GlobalSectionContainer, GlobalSectionHeader } from './styled'
import FormSelector from '@components/spotlight/ActionStage/Forms/FormSelector'
import { FormProvider, useForm } from 'react-hook-form'
import { set, get } from 'lodash'
import { mog } from '@utils/lib/helper'
import { LoadingButton } from '@components/mex/Buttons/LoadingButton'
import { Icon } from '@iconify/react'
import { LOCALSTORAGE_NAMESPACES } from '@workduck-io/action-request-helper'

const GlobalSection: React.FC<{ globalId: string; actionGroupId: string }> = ({ actionGroupId, globalId }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const formMethods = useForm()
  const { getConfig } = useActionPerformer()

  const globalConfig = useMemo(() => getConfig(actionGroupId, globalId), [globalId])

  const withFooter = (form: any) => {
    const newForm = {}
    const configForm = globalConfig?.form ?? []

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

  const onClick = () => {
    if (isEdit) return formMethods.handleSubmit(onSubmit)()
    return setIsEdit(true)
  }

  const onSubmit = async (form?: any) => {
    const updatedForm = withFooter(form)
    setIsSubmitting(true)

    try {
      await actionPerformer.createGlobalIdWorkspace(globalConfig?.actionGroupId?.toLowerCase(), updatedForm)
      setIsSubmitting(false)
      setIsEdit(false)
    } catch (err) {
      mog('Unable to update data')
      setIsSubmitting(false)
    }
  }

  const globalIdsCache = useMemo(() => {
    const globalIds = actionPerformer.getGlobalId(LOCALSTORAGE_NAMESPACES.GLOBAL, actionGroupId)
    return globalIds
  }, [globalId])

  return (
    <GlobalSectionContainer>
      <div>Connect with</div>
      <FormProvider {...formMethods}>
        <GlobalSectionHeader>
          {globalConfig?.form?.map((field) => {
            const defaultValue = globalIdsCache?.select
              ? { label: globalIdsCache?.select?.label, value: globalIdsCache.select }
              : get(globalIdsCache, field.key)

            return (
              <FormSelector
                saveSelected
                defaultValue={defaultValue}
                key={field.actionId}
                element={field}
                disabled={!isEdit}
              />
            )
          })}
        </GlobalSectionHeader>
        <LoadingButton dots={2} loading={isSubmitting} buttonProps={{ onClick, transparent: true }}>
          <Icon width={24} icon={isEdit ? 'teenyicons:tick-circle-solid' : 'clarity:note-edit-solid'} />
        </LoadingButton>
      </FormProvider>
    </GlobalSectionContainer>
  )
}

export default GlobalSection
