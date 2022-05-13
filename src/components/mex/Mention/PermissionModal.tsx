import { getAccessValue, useMentions } from '@hooks/useMentions'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import { usePermission } from '@services/auth/usePermission'
import { useEditorStore } from '@store/useEditorStore'
import { StyledCreatatbleSelect } from '@style/Form'
import { mog } from '@utils/lib/helper'
import React, { useMemo } from 'react'
import IconButton, { Button } from '../../../style/Buttons'
import { AccessLevel, DefaultPermissionValue, permissionOptions } from '../../../types/mentions'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { InvitedUsersContent } from './InvitedUsersContent'
import { MultiEmailInviteModalContent } from './MultiEmailInvite'
import {
  ShareAlias,
  ShareAliasInput,
  SharedPermissionsTable,
  SharedPermissionsWrapper,
  ShareEmail,
  SharePermission,
  ShareRowAction,
  ShareRow,
  ShareRowHeading
} from './ShareModal.styles'
import { useShareModalStore } from './ShareModalStore'

export const PermissionModalContent = (/*{}: PermissionModalContentProps*/) => {
  const closeModal = useShareModalStore((s) => s.closeModal)
  const { getSharedUsersForNode, getInvitedUsersForNode } = useMentions()
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

  const invitedUsers = useMemo(() => {
    if (node && node.nodeid) {
      return getInvitedUsersForNode(node.nodeid)
    }
    return []
  }, [node, getInvitedUsersForNode])

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

      {sharedUsers.length > 0 && (
        <>
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
                  <ShareRowAction>
                    <IconButton onClick={() => onRevokeAccess(user.userid)} icon={deleteBin6Line} title="Remove" />
                  </ShareRowAction>
                </ShareRow>
              )
            })}
          </SharedPermissionsTable>

          <ModalControls>
            <Button large onClick={onCopyLink}>
              Copy Link
            </Button>
            <Button
              primary
              autoFocus={!focus}
              large
              onClick={onSave}
              disabled={changedUsers && changedUsers.length === 0}
            >
              Save
            </Button>
          </ModalControls>
        </>
      )}

      {invitedUsers.length > 0 && <InvitedUsersContent />}
    </SharedPermissionsWrapper>
  )
}
