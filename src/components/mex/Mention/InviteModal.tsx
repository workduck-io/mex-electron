import { EMAIL_REG } from '@data/Defaults/auth'
import { replaceUserMention, replaceUserMentionEmail } from '@editor/Actions/replaceUserMention'
import { useMentions } from '@hooks/useMentions'
import { useAuthStore } from '@services/auth/useAuth'
import { usePermission } from '@services/auth/usePermission'
import { useUserService } from '@services/auth/useUserService'
import { useEditorStore } from '@store/useEditorStore'
import { ButtonFields, Label, SelectWrapper, StyledCreatatbleSelect } from '@style/Form'
import { Title } from '@style/Typography'
import { getPlateEditorRef, usePlateEditorRef } from '@udecode/plate'
import { mog } from '@utils/lib/helper'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AccessLevel, DefaultPermission, DefaultPermissionValue, permissionOptions } from '../../../types/mentions'
import { LoadingButton } from '../Buttons/LoadingButton'
import { InputFormError } from '../Forms/Input'
import { InviteFormWrapper, InviteWrapper } from './ShareModal.styles'
import { InviteModalData, useShareModalStore } from './ShareModalStore'

export const InviteModalContent = () => {
  const data = useShareModalStore((state) => state.data)
  const closeModal = useShareModalStore((state) => state.closeModal)
  const { getUserDetails } = useUserService()
  const localUserDetails = useAuthStore((s) => s.userDetails)
  const node = useEditorStore((state) => state.node)
  const { inviteUser, addMentionable, saveMentionData } = useMentions()
  const { grantUsersPermission } = usePermission()

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const onSubmit = async (data: InviteModalData) => {
    if (node && node.nodeid) {
      const editor = getPlateEditorRef()
      const access = (data?.access?.value as AccessLevel) ?? DefaultPermission

      const details = await getUserDetails(data.email)
      mog('data', { data, details })

      if (details.userId !== undefined) {
        // Give permission here
        if (details.userId === localUserDetails.userId) {
          toast("Can't Invite Yourself")
          closeModal()
          return
        }
        const resp = await grantUsersPermission(node.nodeid, [details.userId], access)
        mog('UserPermission given', { details, resp })
        addMentionable(data.alias, data.email, details.userId, node.nodeid, access)
        replaceUserMention(editor, data.alias, details.userId)
        toast(`Shared with: ${data.email}`)
      } else {
        inviteUser(data.email, data.alias, node.nodeid, access)
        replaceUserMentionEmail(editor, data.alias, details.email)
        toast(`${data.email} is not on Mex, added to Invited Users`)
      }
      saveMentionData()
    }

    closeModal()
  }

  return (
    <InviteWrapper>
      <Title>Invite</Title>
      <p>Invite your friends to your Note.</p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InputFormError
          name="alias"
          label="Alias"
          inputProps={{
            defaultValue: data.alias ?? '',
            ...register('alias', {
              required: true
            })
          }}
          errors={errors}
        ></InputFormError>
        <InputFormError
          name="email"
          label="Email"
          inputProps={{
            autoFocus: true,
            ...register('email', {
              required: true,
              pattern: EMAIL_REG
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

// interface PermissionModalContentProps { }
