import { EMAIL_REG } from '@data/Defaults/auth'
import { replaceUserMention, replaceUserMentionEmail } from '@editor/Actions/replaceUserMention'
import { useMentions } from '@hooks/useMentions'
import { useNodes } from '@hooks/useNodes'
import { useAuthStore } from '@services/auth/useAuth'
import { usePermission } from '@services/auth/usePermission'
import { useUserService } from '@services/auth/useUserService'
import { useEditorStore } from '@store/useEditorStore'
import { ButtonFields, Label, SelectWrapper, StyledCreatatbleSelect } from '@style/Form'
import { Title } from '@style/Typography'
import { getPlateEditorRef, usePlateEditorRef } from '@udecode/plate'
import { mog } from '@utils/lib/helper'
import React, { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AccessLevel, DefaultPermission, DefaultPermissionValue, permissionOptions } from '../../../types/mentions'
import { LoadingButton } from '../Buttons/LoadingButton'
import { InputFormError } from '../Forms/Input'
import { InviteFormFieldset, InviteFormWrapper, InviteWrapper } from './ShareModal.styles'
import { InviteModalData, useShareModalStore } from './ShareModalStore'

export const InviteModalContent = () => {
  const data = useShareModalStore((state) => state.data)
  const closeModal = useShareModalStore((state) => state.closeModal)
  const { getUserDetails } = useUserService()
  const currentUserDetails = useAuthStore((s) => s.userDetails)
  const node = useEditorStore((state) => state.node)
  const { inviteUser, addMentionable, saveMentionData } = useMentions()
  const { grantUsersPermission } = usePermission()
  const { accessWhenShared } = useNodes()

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting }
  } = useForm<InviteModalData>()

  const readOnly = useMemo(() => {
    const access = accessWhenShared(node.nodeid)
    if (access) return access !== 'MANAGE'
    // By default, if no access -> user is the owner
    return false
  }, [node])

  const onSubmit = async (data: InviteModalData) => {
    if (node && node.nodeid) {
      const editor = getPlateEditorRef()
      const access = (data?.access?.value as AccessLevel) ?? DefaultPermission

      const details = await getUserDetails(data.email)
      mog('data', { data, details })

      if (details.userID !== undefined) {
        // Give permission here
        if (details.userID === currentUserDetails.userID) {
          toast("Can't Invite Yourself")
          closeModal()
          return
        }
        const resp = await grantUsersPermission(node.nodeid, [details.userID], access)
        mog('UserPermission given', { details, resp })
        addMentionable(details.alias, data.email, details.userID, node.nodeid, access)
        replaceUserMention(editor, data.alias, details.userID)
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
        <InviteFormFieldset disabled={readOnly}>
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
        </InviteFormFieldset>
      </InviteFormWrapper>
    </InviteWrapper>
  )
}

// interface PermissionModalContentProps { }
