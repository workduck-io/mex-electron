import React, { useEffect, useState } from 'react'
import { ActionHelperConfig, FormField, MenuPostActionConfig } from '@workduck-io/action-request-helper'
import { useActionPerformer } from '@components/spotlight/Actions/useActionPerformer'
import ActionFormElement from '../Forms/Fields/ActionFormElement'
import FormSelector from '../Forms/FormSelector'
import { useForm, FormProvider } from 'react-hook-form'
import { set } from 'lodash'
import { useSpotlightAppStore } from '@store/app.spotlight'
import { FormLoadingButton, MenuForm, NoOption } from './styled'
import tinykeys from 'tinykeys'
import { mog } from '@utils/lib/helper'
import useActionMenuStore from './useActionMenuStore'
import Tippy from '@tippyjs/react'
import { DisplayShortcut } from '@components/mex/Shortcuts'
import { ShortcutText } from '@components/spotlight/Home/components/Item'
import { MexIcon } from '@style/Layouts'
import { useActionStore } from '@components/spotlight/Actions/useActionStore'

type MenuActionFormProps = {
  action: MenuPostActionConfig
}

type MenuFieldProps = {
  field: FormField
  isCurrent: boolean
  onSelect: () => void
}

/**
 *
 * @param field, isCurrent, onSelect
 * @returns Individual form elements for the update action
 */
const MenuField: React.FC<MenuFieldProps> = ({ field, isCurrent, onSelect }) => {
  if (isCurrent)
    return (
      <ActionFormElement required={field.options.required} key={field.key} flex={field.options.flex}>
        <FormSelector element={field} disabled={false} isMenuAction />
      </ActionFormElement>
    )
  return null
}

/**
 *
 * @param action
 * @returns Update action form
 */
const MenuActionForm: React.FC<MenuActionFormProps> = ({ action }) => {
  const { getConfigWithActionId, performer } = useActionPerformer()
  const setIsMenuOpen = useActionStore((store) => store.setIsMenuOpen)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [activeIndex, setActiveIndex] = useState<number>(0)
  const formMethods = useForm()

  const actionDetails: ActionHelperConfig = getConfigWithActionId(action.actionId)

  const handleSelect = (index: number) => {
    setActiveIndex(index)
    setIsMenuOpen(true)
  }

  const withFooter = (form: any) => {
    const newForm = {}
    const configForm = actionDetails?.form ?? []

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

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Enter': async (event) => {
        event.preventDefault()
        await onSubmit()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const onSubmit = async (form?: any) => {
    setIsSubmitting(true)
    const updatedForm = withFooter(form)
    try {
      await performer(actionDetails?.actionGroupId, action.actionId, { formData: updatedForm, parent: true })
      useActionMenuStore.getState().clearMenuStore()
    } catch (err) {
      mog('Unable to update data')
    }
    setIsSubmitting(false)
  }

  return (
    <FormProvider {...formMethods}>
      <MenuForm id="menu-action-form" onSubmit={formMethods.handleSubmit(onSubmit)}>
        {actionDetails?.form?.map((field, index) => {
          return (
            <MenuField
              key={field.actionId}
              field={field}
              isCurrent={index === activeIndex}
              onSelect={() => handleSelect(index)}
            />
          )
        })}
      </MenuForm>
      <Tippy
        theme="mex"
        arrow={false}
        placement="top"
        content={
          <ShortcutText key="send">
            <DisplayShortcut shortcut="$mod+Enter" />
          </ShortcutText>
        }
      >
        <FormLoadingButton
          loading={isSubmitting}
          alsoDisabled={!formMethods.formState.isDirty}
          buttonProps={{ type: 'submit', form: 'menu-action-form', primary: true }}
        >
          <NoOption>
            <MexIcon noHover icon="ion:create-outline" margin="0 0.5rem 0 0" height="1.25rem" width="1.25rem" />
            Update
          </NoOption>
        </FormLoadingButton>
      </Tippy>
    </FormProvider>
  )
}

export default MenuActionForm
