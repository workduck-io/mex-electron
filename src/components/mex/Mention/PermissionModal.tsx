import { MultiEmailValidate } from '@data/Defaults/auth'
import { getAccessValue, useMentions } from '@hooks/useMentions'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import { usePermission } from '@services/auth/usePermission'
import { useUserService } from '@services/auth/useUserService'
import { useEditorStore } from '@store/useEditorStore'
import { ButtonFields, Label, SelectWrapper, StyledCreatatbleSelect } from '@style/Form'
import { Title } from '@style/Typography'
import { mog } from '@utils/lib/helper'
import React, { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import IconButton, { Button } from '../../../style/Buttons'
import {
    AccessLevel, DefaultPermissionValue, permissionOptions
} from '../../../types/mentions'
import { LoadingButton } from '../Buttons/LoadingButton'
import { InputFormError } from '../Forms/Input'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import {
    InviteFormWrapper,
    InviteWrapper,
    ShareAlias,
    ShareAliasInput,
    SharedPermissionsTable,
    SharedPermissionsWrapper,
    ShareEmail,
    SharePermission,
    ShareRemove,
    ShareRow,
    ShareRowHeading
} from './ShareModal.styles'
import {InviteModalData, useShareModalStore} from './ShareModalStore'

const MultiEmailInviteModalContent = () => {
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

export const PermissionModalContent = (/*{}: PermissionModalContentProps*/) => {
  const closeModal = useShareModalStore((s) => s.closeModal)
  const { getSharedUsersForNode } = useMentions()
  const node = useEditorStore((state) => state.node)
  const changedUsers = useShareModalStore((state) => state.data.changedUsers)
  const setChangedUsers = useShareModalStore((state) => state.setChangedUsers)
  const { changeUserPermission, revokeUserAccess } = usePermission()

  const sharedUsers = useMemo(() => {
    if (node && node.nodeid) {
      return getSharedUsersForNode(node.nodeid)
    }
    return []
  }, [node, getSharedUsersForNode])

  const onCopyLink = () => {
    closeModal()
  }

  // This is called for every keystroke
  const onAliasChange = (userid: string, alias: string) => {
    // mog('onPermissionChange', { userid, alias })

    // Change the user and add to changedUsers
    const changedUser = changedUsers.find((u) => u.userid === userid)
    const dataUser = sharedUsers.find((u) => u.userid === userid)

    if (changedUser) {
      changedUser.alias = alias
      changedUser.change.push('alias')
      setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
    } else if (dataUser) {
      dataUser.alias = alias
      const changeUser = { ...dataUser, change: ['alias' as const] }
      setChangedUsers([...changedUsers, changeUser])
    }
  }

  // This is called for every keystroke
  const onRevokeAccess = (userid: string) => {
    // mog('onPermissionChange', { userid, alias })

    // Change the user and add to changedUsers
    const changedUser = changedUsers.find((u) => u.userid === userid)
    const dataUser = sharedUsers.find((u) => u.userid === userid)

    if (changedUser) {
      const hasBeenRevoked = changedUser.change.includes('revoke')
      if (hasBeenRevoked) {
        changedUser.change = changedUser.change.filter((p) => p !== 'revoke')
        setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
      } else {
        changedUser.change.push('revoke')
        setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
      }
    } else if (dataUser) {
      const changeUser = { ...dataUser, change: ['revoke' as const] }
      setChangedUsers([...changedUsers, changeUser])
    }
  }

  const onPermissionChange = (userid: string, access: AccessLevel) => {
    // Change the user and add to changedUsers
    const changedUser = changedUsers.find((u) => u.userid === userid)
    const dataUser = sharedUsers.find((u) => u.userid === userid)
    mog('onPermissionChange', { userid, access, changedUsers, changedUser, dataUser })

    // TODO: Filter for the case when user permission is reverted to the og one
    if (changedUser) {
      const prevAccess = changedUser?.access[node.nodeid]
      const ogAccess = dataUser?.access[node.nodeid]
      if (ogAccess && access === ogAccess) {
        mog('removing user from changedUsers', { changedUser, access, ogAccess })
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
          } else {
            setChangedUsers([...changedUsers.filter((u) => u.userid !== userid)])
          }
        }
      } else if (prevAccess !== access) {
        changedUser.access[node.nodeid] = access
        changedUser.change.push('permission')
        setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
      } else {
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedUsers([...changedUsers.filter((u) => u.userid !== userid), changedUser])
          } else {
            setChangedUsers([...changedUsers.filter((u) => u.userid !== userid)])
          }
        }
      }
    } else if (dataUser) {
      const prevAccess = dataUser?.access[node.nodeid]
      if (prevAccess !== access) {
        dataUser.access[node.nodeid] = access
        const changeUser = { ...dataUser, change: ['permission' as const] }
        setChangedUsers([...changedUsers, changeUser])
      }
    }
  }

  const onSave = async () => {
    // Only when change is done to permission

    // We change for users that have not been revoked
    const withoutRevokeChanges = changedUsers.filter((u) => !u.change.includes('revoke'))
    const newPermissions: { [userid: string]: AccessLevel } = withoutRevokeChanges
      .filter((u) => u.change.includes('permission'))
      .reduce((acc, user) => {
        return { ...acc, [user.userid]: user.access[node.nodeid] }
      }, {})

    const newAliases = withoutRevokeChanges
      .filter((u) => u.change.includes('alias'))
      .reduce((acc, user) => {
        acc.push({
          userid: user.userid,
          alias: user.alias
        })
        return acc
      }, [])

    const revokedUsers = changedUsers
      .filter((u) => u.change.includes('revoke'))
      .reduce((acc, user) => {
        acc.push(user.userid)
        return acc
      }, [])

    const applyPermissions = async () => {
      const userChangePerm = await changeUserPermission(node.nodeid, newPermissions)
      const userRevoke = await revokeUserAccess(node.nodeid, revokedUsers)
      mog('set new permissions', { userChangePerm, userRevoke })
    }

    await applyPermissions()

    closeModal()

    mog('onSave', { changedUsers, newPermissions, newAliases, revokedUsers })
  }

  return (
    <SharedPermissionsWrapper>
      <ModalHeader>Share Note</ModalHeader>

      <MultiEmailInviteModalContent />

      <SharedPermissionsTable>
        <caption>Users with access to this note</caption>
        <ShareRowHeading>
          <tr>
            <td>Alias</td>
            <td>Email</td>
            <td>Permission</td>
            <td></td>
          </tr>
        </ShareRowHeading>

        {sharedUsers.map((user) => {
          const access = user.access[node.nodeid]
          const hasChanged = changedUsers.find((u) => u.userid === user.userid)
          const isRevoked = !!hasChanged && hasChanged.change.includes('revoke')
          return (
            <ShareRow hasChanged={!!hasChanged} key={`${user.userid}`} isRevoked={isRevoked}>
              <ShareAlias hasChanged={!!hasChanged}>
                <ShareAliasInput
                  type="text"
                  defaultValue={user.alias}
                  onChange={(e) => onAliasChange(user.userid, e.target.value)}
                />
              </ShareAlias>
              <ShareEmail>{user.email}</ShareEmail>

              <SharePermission>
                <StyledCreatatbleSelect
                  onChange={(access) => onPermissionChange(user.userid, access.value)}
                  defaultValue={getAccessValue(access) ?? DefaultPermissionValue}
                  options={permissionOptions}
                  closeMenuOnSelect={true}
                  closeMenuOnBlur={true}
                />
              </SharePermission>
              <ShareRemove>
                <IconButton onClick={() => onRevokeAccess(user.userid)} icon={deleteBin6Line} title="Remove" />
              </ShareRemove>
            </ShareRow>
          )
        })}
      </SharedPermissionsTable>

      <ModalControls>
        <Button large onClick={onCopyLink}>
          Copy Link
        </Button>
        <Button primary autoFocus={!focus} large onClick={onSave} disabled={changedUsers && changedUsers.length === 0}>
          Save
        </Button>
      </ModalControls>
    </SharedPermissionsWrapper>
  )
}

