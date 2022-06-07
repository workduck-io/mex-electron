import { getAccessValue, useMentions } from '@hooks/useMentions'
import { useNodes } from '@hooks/useNodes'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import { usePermission } from '@services/auth/usePermission'
import { useEditorStore } from '@store/useEditorStore'
import { useMentionStore } from '@store/useMentionStore'
import { StyledCreatatbleSelect } from '@style/Form'
import { mog } from '@utils/lib/helper'
import React, { useEffect, useMemo, useState } from 'react'
import IconButton, { Button } from '../../../style/Buttons'
import { AccessLevel, DefaultPermissionValue, Mentionable, permissionOptions } from '../../../types/mentions'
import { ModalControls, ModalHeader, ModalSection, ModalSectionScroll } from '../Refactor/styles'
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
  ShareRowHeading,
  ShareRowActionsWrapper,
  ShareOwnerTag,
  ShareAliasWithImage
} from './ShareModal.styles'
import { useShareModalStore } from './ShareModalStore'
import { useAuthStore } from '@services/auth/useAuth'
import { ProfileImage } from '../User/ProfileImage'

export const PermissionModalContent = (/*{}: PermissionModalContentProps*/) => {
  const closeModal = useShareModalStore((s) => s.closeModal)
  const open = useShareModalStore((s) => s.open)
  const { getSharedUsersForNode, getInvitedUsersForNode, applyChangesMentionable } = useMentions()
  const mentionable = useMentionStore((s) => s.mentionable)
  const node = useEditorStore((state) => state.node)
  const currentUserDetails = useAuthStore((s) => s.userDetails)
  const changedUsers = useShareModalStore((state) => state.data.changedUsers)
  const setChangedUsers = useShareModalStore((state) => state.setChangedUsers)
  const { changeUserPermission, revokeUserAccess } = usePermission()
  const { accessWhenShared } = useNodes()

  const readOnly = useMemo(() => {
    // to test: return true
    const access = accessWhenShared(node.nodeid)
    if (access) return access !== 'MANAGE'
    return false
  }, [node])

  const [sharedUsers, setSharedUsers] = useState<Mentionable[]>([])

  useEffect(() => {
    if (node && node.nodeid) {
      const sUsers = getSharedUsersForNode(node.nodeid)
      setSharedUsers(sUsers)
    }
  }, [node, mentionable, open])

  const invitedUsers = useMemo(() => {
    if (node && node.nodeid) {
      return getInvitedUsersForNode(node.nodeid)
    }
    return []
  }, [node])

  const onCopyLink = () => {
    closeModal()
  }

  // This is called for every keystroke
  const onAliasChange = (userid: string, alias: string) => {
    // mog('onPermissionChange', { userid, alias })

    // Change the user and add to changedUsers
    const changedUser = changedUsers.find((u) => u.userID === userid)
    const dataUser = sharedUsers.find((u) => u.userID === userid)

    if (changedUser) {
      changedUser.alias = alias
      changedUser.change.push('alias')
      setChangedUsers([...changedUsers.filter((u) => u.userID !== userid), changedUser])
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
    const changedUser = changedUsers.find((u) => u.userID === userid)
    const dataUser = sharedUsers.find((u) => u.userID === userid)

    if (changedUser) {
      const hasBeenRevoked = changedUser.change.includes('revoke')
      if (hasBeenRevoked) {
        changedUser.change = changedUser.change.filter((p) => p !== 'revoke')
        setChangedUsers([...changedUsers.filter((u) => u.userID !== userid), changedUser])
      } else {
        changedUser.change.push('revoke')
        setChangedUsers([...changedUsers.filter((u) => u.userID !== userid), changedUser])
      }
    } else if (dataUser) {
      const changeUser = { ...dataUser, change: ['revoke' as const] }
      setChangedUsers([...changedUsers, changeUser])
    }
  }

  const onPermissionChange = (userid: string, access: AccessLevel) => {
    // Change the user and add to changedUsers
    const changedUser = changedUsers.find((u) => u.userID === userid)
    const dataUser = sharedUsers.find((u) => u.userID === userid)

    // TODO: Filter for the case when user permission is reverted to the og one
    if (changedUser) {
      const prevAccess = changedUser?.access[node.nodeid]
      const ogAccess = dataUser?.access[node.nodeid]
      if (ogAccess && access === ogAccess) {
        // mog('removing user from changedUsers', { changedUser, access, ogAccess })
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedUsers([...changedUsers.filter((u) => u.userID !== userid), changedUser])
          } else {
            setChangedUsers([...changedUsers.filter((u) => u.userID !== userid)])
          }
        }
      } else if (prevAccess !== access) {
        changedUser.access[node.nodeid] = access
        changedUser.change.push('permission')
        setChangedUsers([...changedUsers.filter((u) => u.userID !== userid), changedUser])
      } else {
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedUsers([...changedUsers.filter((u) => u.userID !== userid), changedUser])
          } else {
            setChangedUsers([...changedUsers.filter((u) => u.userID !== userid)])
          }
        }
      }
    } else if (dataUser) {
      const prevAccess = dataUser?.access[node.nodeid]
      // mog('onPermissionChange only DataUser', { userid, access, dataUser, prevAccess, node })
      // return
      if (prevAccess !== access) {
        const changeUser = {
          ...dataUser,
          change: ['permission' as const],
          access: { ...dataUser.access, [node.nodeid]: access }
        }
        // changeUser.access[node.nodeid] = access
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
        return { ...acc, [user.userID]: user.access[node.nodeid] }
      }, {})

    const newAliases = withoutRevokeChanges
      .filter((u) => u.change.includes('alias'))
      .reduce((acc, user) => {
        return { ...acc, [user.userID]: user.alias }
      }, {})

    const revokedUsers = changedUsers
      .filter((u) => u.change.includes('revoke'))
      .reduce((acc, user) => {
        acc.push(user.userID)
        return acc
      }, [])

    mog('Updating after the table changes ', { newAliases, revokedUsers, newPermissions })

    const applyPermissions = async () => {
      if (Object.keys(newPermissions).length > 0) await changeUserPermission(node.nodeid, newPermissions)

      if (revokedUsers.length > 0) await revokeUserAccess(node.nodeid, revokedUsers)
      // mog('set new permissions', { userRevoke })
      applyChangesMentionable(newPermissions, newAliases, revokedUsers, node.nodeid)
    }

    await applyPermissions()

    // Update Aliases
    // Update Permissions
    // Delete Revoked

    closeModal()

    mog('onSave', { changedUsers, newPermissions, newAliases, revokedUsers })
  }

  // mog('ShareInvitedPermissions go brrr', {
  //   sharedUsers,
  //   readOnly,
  //   changedUsers
  // })

  return (
    <>
      <ModalSection>{!readOnly && <MultiEmailInviteModalContent />}</ModalSection>

      {sharedUsers.length > 0 && (
        <ModalSection>
          <ModalHeader>Manage Sharing</ModalHeader>
          <ModalSectionScroll>
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

              <tbody>
                {sharedUsers.map((user) => {
                  const hasChanged = changedUsers.find((u) => u.userID === user.userID)
                  const access = hasChanged ? hasChanged.access[node.nodeid] : user.access[node.nodeid]
                  const isRevoked = !!hasChanged && hasChanged.change.includes('revoke')
                  const isCurrent = user.userID === currentUserDetails.userID

                  return (
                    <ShareRow hasChanged={!!hasChanged} key={`${user.userID}`} isRevoked={isRevoked}>
                      <ShareAlias hasChanged={!!hasChanged}>
                        <ShareAliasWithImage>
                          <ProfileImage email={user.email} size={24} />
                          {/*<ShareAliasInput
                      type="text"
                      disabled={true}
                      defaultValue={`${user.alias}${isCurrent ? ' (you)' : ''}`}
                      onChange={(e) => onAliasChange(user.userid, e.target.value)}
                    /> */}
                          {`${user.alias}${isCurrent ? ' (you)' : ''}`}
                        </ShareAliasWithImage>
                      </ShareAlias>
                      <ShareEmail>{user.email}</ShareEmail>

                      <SharePermission disabled={readOnly || isCurrent}>
                        {user.access[node.nodeid] === 'OWNER' ? (
                          <ShareOwnerTag>Owner</ShareOwnerTag>
                        ) : (
                          <StyledCreatatbleSelect
                            onChange={(access) => onPermissionChange(user.userID, access.value)}
                            defaultValue={getAccessValue(access) ?? DefaultPermissionValue}
                            options={permissionOptions}
                            closeMenuOnSelect={true}
                            closeMenuOnBlur={true}
                          />
                        )}
                      </SharePermission>
                      <ShareRowAction>
                        <ShareRowActionsWrapper>
                          {!isCurrent && access !== 'OWNER' && (
                            <IconButton
                              disabled={readOnly}
                              onClick={() => onRevokeAccess(user.userID)}
                              icon={deleteBin6Line}
                              title="Remove"
                            />
                          )}
                        </ShareRowActionsWrapper>
                      </ShareRowAction>
                    </ShareRow>
                  )
                })}
              </tbody>
            </SharedPermissionsTable>
          </ModalSectionScroll>

          <ModalControls>
            <Button disabled={readOnly} large onClick={onCopyLink}>
              Copy Link
            </Button>
            <Button
              primary
              autoFocus={!focus}
              large
              onClick={onSave}
              disabled={readOnly || (changedUsers && changedUsers.length === 0)}
            >
              Save
            </Button>
          </ModalControls>
        </ModalSection>
      )}

      {!readOnly && invitedUsers.length > 0 && <InvitedUsersContent />}
    </>
  )
}
