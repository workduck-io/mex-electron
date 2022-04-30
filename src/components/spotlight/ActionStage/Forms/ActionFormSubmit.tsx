import React from 'react'
import { useSpotlightAppStore } from '../../../../store/app.spotlight'
import { useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { LoadingButton } from '../../../mex/Buttons/LoadingButton'
import { useActionPerformer } from '../../Actions/useActionPerformer'

const ActionFormSubmit = () => {
  const isLoading = useSpotlightAppStore((s) => s.isLoading)
  const { performer } = useActionPerformer()
  const { activeItem } = useSpotlightContext()

  const onSubmit = () => {
    const actionGroup = activeItem?.item?.extras?.actionGroup
    performer(actionGroup?.actionGroupId, activeItem?.item?.id)
  }

  return (
    <LoadingButton
      buttonProps={{ onClick: onSubmit, type: 'submit', form: 'wd-mex-post-action-form' }}
      loading={isLoading}
      alsoDisabled
      style={{ border: 'none' }}
    >
      {activeItem?.item?.title}
    </LoadingButton>
  )
}

export default ActionFormSubmit
