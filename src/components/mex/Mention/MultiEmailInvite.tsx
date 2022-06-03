import { getEmailStart, MultiEmailValidate } from '@data/Defaults/auth'
import { useMentions } from '@hooks/useMentions'
import { useAuthStore } from '@services/auth/useAuth'
import { usePermission } from '@services/auth/usePermission'
import { useUserService } from '@services/auth/useUserService'
import { useEditorStore } from '@store/useEditorStore'
import { useMentionStore } from '@store/useMentionStore'
import { ButtonFields, Label, SelectWrapper, StyledCreatatbleSelect } from '@style/Form'
import { Title } from '@style/Typography'
import { mog } from '@utils/lib/helper'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AccessLevel, DefaultPermission, DefaultPermissionValue, permissionOptions } from '../../../types/mentions'
import { LoadingButton } from '../Buttons/LoadingButton'
import { InputFormError } from '../Forms/Input'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { InviteFormFieldset, InviteFormWrapper, InviteWrapper, MultipleInviteWrapper } from './ShareModal.styles'
import { InviteModalData } from './ShareModalStore'

export const MultiEmailInviteModalContent = ({ disabled }: { disabled?: boolean }) => {
  const addInvitedUser = useMentionStore((state) => state.addInvitedUser)
  const addMentionable = useMentionStore((state) => state.addMentionable)
  // const closeModal = useShareModalStore((state) => state.closeModal)
  const { getUserDetails } = useUserService()
  const { saveMentionData } = useMentions()
  const { grantUsersPermission } = usePermission()
  const localuserDetails = useAuthStore((s) => s.userDetails)
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
      const access = (data?.access?.value as AccessLevel) ?? DefaultPermission

      const userDetailPromises = allMails
        .filter((e) => e !== localuserDetails.email)
        .map((email) => {
          return getUserDetails(email)
        })

      const userDetails = await Promise.allSettled(userDetailPromises)

      mog('userDetails', { userDetails })

      // Typescript has some weird thing going on with promises.
      // Try to improve the type (if you can that is)
      const existing = userDetails.filter((p) => p.status === 'fulfilled' && p.value.userID !== undefined) as any[]
      const absent = userDetails.filter((p) => p.status === 'fulfilled' && p.value.userID === undefined) as any[]

      const givePermToExisting = existing
        .reduce((p, c) => {
          return [...p, c.value.userID]
        }, [])
        .filter((u) => u !== localuserDetails.userID)

      // Only share with users registered,
      if (givePermToExisting.length > 0) {
        const permGiven = await grantUsersPermission(node.nodeid, givePermToExisting, access)
        mog('userDetails', { userDetails, permGiven, existing, absent, givePermToExisting })
      }

      existing.forEach((u) => {
        addMentionable({
          type: 'mentionable',
          alias: u?.value?.alias ?? '',
          email: u?.value?.email,
          userID: u?.value?.userID,
          name: u?.value?.name,
          access: {
            [node?.nodeid]: access
          }
        })
      })

      // Add the rest to invited users
      absent.forEach((u) => {
        addInvitedUser({
          type: 'invite',
          alias: getEmailStart(u?.value?.email),
          email: u?.value?.email,
          access: {
            [node?.nodeid]: access
          }
        })
      })

      saveMentionData()

      // closeModal()
    }
  }

  // mog('MultiEmailInvite', { errors })

  return (
    <MultipleInviteWrapper>
      <ModalHeader>Invite Users</ModalHeader>
      <p>Invite your friends to your Note.</p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InviteFormFieldset disabled={disabled}>
          <InputFormError
            name="email"
            label="Emails"
            inputProps={{
              autoFocus: true,
              placeholder: 'alice@email.com, bob@email.com',
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

          <ModalControls>
            <LoadingButton
              loading={isSubmitting}
              alsoDisabled={errors.email !== undefined || errors.alias !== undefined}
              buttonProps={{ type: 'submit', primary: true, large: true }}
            >
              Invite
            </LoadingButton>
          </ModalControls>
        </InviteFormFieldset>
      </InviteFormWrapper>
    </MultipleInviteWrapper>
  )
}
