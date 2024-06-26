import React, { useMemo } from 'react'

import { getAccessValue, useMentions } from '@hooks/useMentions'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import repeatLine from '@iconify/icons-ri/repeat-line'
import { usePermission } from '@services/auth/usePermission'
import { useUserService } from '@services/auth/useUserService'
import { useEditorStore } from '@store/useEditorStore'
import { useMentionStore } from '@store/useMentionStore'
import { StyledCreatatbleSelect } from '@style/Form'
import { mog } from '@utils/lib/mog'

import { Button, IconButton } from '@workduck-io/mex-components'

import { AccessLevel, DefaultPermissionValue, InvitedUser, permissionOptions } from '../../../types/mentions'
import { ModalControls, ModalHeader, ModalSection, ModalSectionScroll } from '../Refactor/styles'
import {
  ShareAlias,
  ShareAliasInput,
  SharedPermissionsTable,
  ShareEmail,
  SharePermission,
  ShareRowAction,
  ShareRow,
  ShareRowHeading,
  ShareRowActionsWrapper
} from './ShareModal.styles'
import { useShareModalStore } from './ShareModalStore'

// Here since we don't have a specific userid we take email to be a unique key.
export const InvitedUsersContent = (/*{}: PermissionModalContentProps*/) => {
  const { getInvitedUsersForNode } = useMentions()
  const node = useEditorStore((state) => state.node)
  const { grantUsersPermission } = usePermission()
  const { getUserDetails } = useUserService()
  const invitedUsers = useMentionStore((s) => s.invitedUsers)
  const modalData = useShareModalStore((state) => state.data)
  const changedIUsers = useShareModalStore((state) => state.data.changedInvitedUsers)
  const setChangedIUsers = useShareModalStore((state) => state.setChangedInvitedUsers)
  // const { changeUserPermission, revokeUserAccess } = usePermission()

  const nodeid = useMemo(() => modalData?.nodeid ?? node?.nodeid, [modalData.nodeid, node])

  const sharedIUsers = useMemo(() => {
    if (nodeid) {
      return getInvitedUsersForNode(nodeid)
    }
    return []
  }, [nodeid, invitedUsers])

  // This is called for every keystroke
  const onAliasChange = (email: string, alias: string) => {
    mog('onAliasCHange', { email, alias })

    // Change the user and add to changedUsers
    const changedUser = changedIUsers.find((u) => u.email === email)
    const dataUser = sharedIUsers.find((u) => u.email === email)

    if (changedUser) {
      changedUser.alias = alias
      changedUser.change.push('alias')
      setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
    } else if (dataUser) {
      dataUser.alias = alias
      const changeUser = { ...dataUser, change: ['alias' as const] }
      setChangedIUsers([...changedIUsers, changeUser])
    }
  }

  // This is called for every keystroke
  const onRevokeAccess = (email: string) => {
    // mog('onPermissionChange', { userid, email })

    // Change the user and add to changedUsers
    const changedUser = changedIUsers?.find((u) => u.email === email)
    const dataUser = sharedIUsers?.find((u) => u.email === email)

    if (changedUser) {
      const hasBeenRevoked = changedUser.change.includes('revoke')
      if (hasBeenRevoked) {
        changedUser.change = changedUser.change.filter((p) => p !== 'revoke')
        setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
      } else {
        changedUser.change.push('revoke')
        setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
      }
    } else if (dataUser) {
      const changeUser = { ...dataUser, change: ['revoke' as const] }
      setChangedIUsers([...changedIUsers, changeUser])
    }
  }

  const onPermissionChange = (email: string, access: AccessLevel) => {
    // Change the user and add to changedUsers
    const changedUser = changedIUsers.find((u) => u.email === email)
    const dataUser = sharedIUsers.find((u) => u.email === email)
    mog('onPermissionChange', { email, access, changedIUsers, changedUser, dataUser })

    // TODO: Filter for the case when user permission is reverted to the og one
    if (changedUser) {
      const prevAccess = changedUser?.access[nodeid]
      const ogAccess = dataUser?.access[nodeid]
      if (ogAccess && access === ogAccess) {
        mog('removing user from changedUsers', { changedUser, access, ogAccess })
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
          } else {
            setChangedIUsers([...changedIUsers.filter((u) => u.email !== email)])
          }
        }
      } else if (prevAccess !== access) {
        changedUser.access[nodeid] = access
        changedUser.change.push('permission')
        setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
      } else {
        if (changedUser.change.includes('permission')) {
          changedUser.change = changedUser.change.filter((c) => c !== 'permission')
          if (changedUser.change.length !== 0) {
            setChangedIUsers([...changedIUsers.filter((u) => u.email !== email), changedUser])
          } else {
            setChangedIUsers([...changedIUsers.filter((u) => u.email !== email)])
          }
        }
      }
    } else if (dataUser) {
      const prevAccess = dataUser?.access[nodeid]
      if (prevAccess !== access) {
        dataUser.access[nodeid] = access
        const changeUser = { ...dataUser, change: ['permission' as const] }
        setChangedIUsers([...changedIUsers, changeUser])
      }
    }
  }

  const onReinviteUser = async (user: InvitedUser) => {
    const uDetails = await getUserDetails(user.email)
    mog('Reinviting that damn user', { user, uDetails })
    const changedUser = changedIUsers.find((u) => u.email === user.email)
    const dataUser = sharedIUsers.find((u) => u.email === user.email)
    const access = changedUser ? changedUser.access[nodeid] : dataUser.access[nodeid] ?? undefined
    if (uDetails && access) {
      const res = await grantUsersPermission(nodeid, [uDetails.userID], access)
      mog('res', { res })
    }
  }

  const onSave = async () => {
    // Only when change is done to permission

    // We change for users that have not been revoked
    const withoutRevokeChanges = changedIUsers.filter((u) => !u.change.includes('revoke'))
    const newPermissions: { [email: string]: AccessLevel } = withoutRevokeChanges
      .filter((u) => u.change.includes('permission'))
      .reduce((acc, user) => {
        return { ...acc, [user.email]: user.access[nodeid] }
      }, {})

    const newAliases = withoutRevokeChanges
      .filter((u) => u.change.includes('alias'))
      .reduce((acc, user) => {
        acc.push({
          email: user.email,
          alias: user.alias
        })
        return acc
      }, [])

    const revokedUsers = changedIUsers
      .filter((u) => u.change.includes('revoke'))
      .reduce((acc, user) => {
        acc.push(user.email)
        return acc
      }, [])

    // const applyPermissions = async () => {
    //   const userChangePerm = await changeUserPermission(node.nodeid, newPermissions)
    //   const userRevoke = await revokeUserAccess(node.nodeid, revokedUsers)
    //   mog('set new permissions', { userChangePerm, userRevoke })
    // }

    // await applyPermissions()

    // closeModal()

    mog('onSave', { changedIUsers, newPermissions, newAliases, revokedUsers })
  }

  // mog('ShareInvitedPermissions go brrr', {
  //   sharedIUsers
  // })

  return (
    <ModalSection>
      <ModalHeader>Invited Users</ModalHeader>

      <ModalSectionScroll>
        <SharedPermissionsTable>
          <caption>
            Users invited to this note <em>that are not on Mex</em>
          </caption>
          <ShareRowHeading>
            <tr>
              <td>Alias</td>
              <td>Email</td>
              <td>Permission</td>
              <td></td>
            </tr>
          </ShareRowHeading>

          {sharedIUsers.map((user) => {
            const access = user.access[nodeid]
            const hasChanged = changedIUsers && changedIUsers.find((u) => u.email === user.email)
            const isRevoked = !!hasChanged && hasChanged.change.includes('revoke')
            return (
              <ShareRow hasChanged={!!hasChanged} key={`${user.email}`} isRevoked={isRevoked}>
                <ShareAlias hasChanged={!!hasChanged}>
                  <ShareAliasInput
                    type="text"
                    defaultValue={user.alias}
                    onChange={(e) => onAliasChange(user.email, e.target.value)}
                  />
                </ShareAlias>
                <ShareEmail>{user.email}</ShareEmail>

                <SharePermission>
                  <StyledCreatatbleSelect
                    onChange={(access) => onPermissionChange(user.email, access.value)}
                    defaultValue={getAccessValue(access) ?? DefaultPermissionValue}
                    options={permissionOptions}
                    closeMenuOnSelect={true}
                    closeMenuOnBlur={true}
                  />
                </SharePermission>
                <ShareRowAction>
                  <ShareRowActionsWrapper>
                    <IconButton
                      transparent={false}
                      onClick={() => onReinviteUser(user)}
                      icon={repeatLine}
                      title="Reinvite User"
                    />
                    <IconButton onClick={() => onRevokeAccess(user.email)} icon={deleteBin6Line} title="Remove" />
                  </ShareRowActionsWrapper>
                </ShareRowAction>
              </ShareRow>
            )
          })}
        </SharedPermissionsTable>
      </ModalSectionScroll>

      <ModalControls>
        <Button
          primary
          autoFocus={!focus}
          large
          onClick={onSave}
          disabled={changedIUsers && changedIUsers.length === 0}
        >
          Save
        </Button>
      </ModalControls>
    </ModalSection>
  )
}
