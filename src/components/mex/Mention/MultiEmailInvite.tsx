import { MultiEmailValidate } from '@data/Defaults/auth'
import { useUserService } from '@services/auth/useUserService'
import { useEditorStore } from '@store/useEditorStore'
import { ButtonFields, Label, SelectWrapper, StyledCreatatbleSelect } from '@style/Form'
import { Title } from '@style/Typography'
import { mog } from '@utils/lib/helper'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { DefaultPermissionValue, permissionOptions } from '../../../types/mentions'
import { LoadingButton } from '../Buttons/LoadingButton'
import { InputFormError } from '../Forms/Input'
import { InviteFormWrapper, InviteWrapper } from './ShareModal.styles'
import { InviteModalData } from './ShareModalStore'

export const MultiEmailInviteModalContent = () => {
  // const addInvitedUser = useMentionStore((state) => state.addInvitedUser)
  const { getUserDetails } = useUserService()
  const node = useEditorStore((state) => state.node)
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const onSubmit = async (data: InviteModalData) => {
    mog('data', data)

    if (node && node.nodeid) {
      const allMails = data.email.split(',').map((e) => e.trim())

      const userDetailPromises = allMails.map((email) => {
        return getUserDetails(email)
      })

      const userDetails = await Promise.allSettled(userDetailPromises)

      mog('userDetails', { userDetails })

      // const userDetails = allMails.map(async () => {})
      // Only share with users with details, add the rest to invited users

      // addInvitedUser({
      //   type: 'invite',
      //   alias: data.alias,
      //   email: data.email,
      //   access: {
      //     [node.nodeid]: (data.access as AccessLevel) ?? DefaultPermission
      //   }
      // })
    }
  }

  // mog('MultiEmailInvite', { errors })

  return (
    <InviteWrapper>
      <Title>Invite</Title>
      <p>Invite your friends to your Note.</p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InputFormError
          name="email"
          label="Email"
          inputProps={{
            autoFocus: true,
            type: 'email',
            // Accepts multiple emails
            multiple: true,
            ...register('email', {
              required: true,
              validate: MultiEmailValidate
            })
          }}
          errors={errors}
        ></InputFormError>

        <SelectWrapper>
          <Label htmlFor="access">Permission</Label>
          <Controller
            control={control}
            render={({ field }) => (
              <StyledCreatatbleSelect
                {...field}
                defaultValue={DefaultPermissionValue}
                options={permissionOptions}
                closeMenuOnSelect={true}
                closeMenuOnBlur={true}
              />
            )}
            name="access"
          />
        </SelectWrapper>

        <ButtonFields>
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={errors.email !== undefined || errors.alias !== undefined}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            Invite
          </LoadingButton>
        </ButtonFields>
      </InviteFormWrapper>
    </InviteWrapper>
  )
}
