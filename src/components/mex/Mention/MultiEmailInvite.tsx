import { EMAIL_REG, getEmailStart } from '@data/Defaults/auth'
import { useLinks } from '@hooks/useLinks'
import { useMentions } from '@hooks/useMentions'
import { useAuthStore } from '@services/auth/useAuth'
import { usePermission } from '@services/auth/usePermission'
import { useUserService } from '@services/auth/useUserService'
import { useEditorStore } from '@store/useEditorStore'
import { useMentionStore } from '@store/useMentionStore'
import { Label, SelectWrapper, StyledCreatatbleSelect } from '@style/Form'
import { runBatch } from '@utils/lib/batchPromise'
import { mog } from '@utils/lib/helper'
import { LoadingButton } from '@workduck-io/mex-components'
import React, { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AccessLevel, DefaultPermission, DefaultPermissionValue, permissionOptions } from '../../../types/mentions'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { InviteFormFieldset, InviteFormWrapper, MultipleInviteWrapper } from './ShareModal.styles'
import { MultiInviteModalData, useShareModalStore } from './ShareModalStore'

export const MultiEmailInviteModalContent = ({ disabled }: { disabled?: boolean }) => {
  const addInvitedUser = useMentionStore((state) => state.addInvitedUser)
  const addMentionable = useMentionStore((state) => state.addMentionable)
  const modalData = useShareModalStore((state) => state.data)
  // const closeModal = useShareModalStore((state) => state.closeModal)
  const { getUserDetails, getAllKnownUsers } = useUserService()
  const { getPathFromNodeid } = useLinks()
  const { saveMentionData } = useMentions()
  const { grantUsersPermission } = usePermission()
  const localuserDetails = useAuthStore((s) => s.userDetails)
  const node = useEditorStore((state) => state.node)
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<MultiInviteModalData>()

  const nodeid = useMemo(() => modalData?.nodeid ?? node?.nodeid, [modalData.nodeid, node])

  const onSubmit = async (data: MultiInviteModalData) => {
    mog('data', data)

    if (nodeid) {
      const allMails = data.email.map((e) => e.value.trim())
      const access = (data?.access?.value as AccessLevel) ?? DefaultPermission

      const userDetailPromises = allMails
        .filter((e) => e !== localuserDetails.email)
        .map((email) => {
          return getUserDetails(email)
        })

      const userDetails = (await runBatch(userDetailPromises)).fulfilled[0]

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
        const permGiven = await grantUsersPermission(nodeid, givePermToExisting, access)
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
            [nodeid]: access
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
            [nodeid]: access
          }
        })
      })

      saveMentionData()

      reset({ email: [] })
      // closeModal()
    }
  }

  const allEmails = getAllKnownUsers().map((u) => ({
    value: u.email,
    label: `@${u?.alias}`,
    error: false
  }))

  // mog('MultiEmailInvite', { errors })

  return (
    <MultipleInviteWrapper>
      <ModalHeader>Invite Users</ModalHeader>
      <p>
        Invite your friends to your note <strong>{getPathFromNodeid(nodeid)}</strong>.
      </p>
      <InviteFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <InviteFormFieldset disabled={disabled}>
          <SelectWrapper>
            <Label htmlFor="email">Emails</Label>
            <Controller
              control={control}
              render={({ field }) => (
                <StyledCreatatbleSelect
                  {...field}
                  placeholder="Invite Users via email / alias"
                  formatCreateLabel={(inputValue: string) => `Invite ${inputValue} `}
                  isValidNewOption={(inpVal: string, _val) => {
                    const res = inpVal.match(EMAIL_REG)
                    return res !== null
                  }}
                  isMulti
                  options={allEmails}
                  closeMenuOnSelect={true}
                  closeMenuOnBlur={true}
                />
              )}
              name="email"
            />
          </SelectWrapper>

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
              type="submit"
              primary
              large
            >
              Invite
            </LoadingButton>
          </ModalControls>
        </InviteFormFieldset>
      </InviteFormWrapper>
    </MultipleInviteWrapper>
  )
}
