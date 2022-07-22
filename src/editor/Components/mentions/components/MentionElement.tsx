import { useShareModalStore } from '@components/mex/Mention/ShareModalStore'
import AccessTag from '@components/mex/Mention/AccessTag'
import { ProfileImage } from '@components/mex/User/ProfileImage'
import { useMentions } from '@hooks/useMentions'
// import { usePermission } from '@services/auth/usePermission'
import { useEditorStore } from '@store/useEditorStore'
// import { useMentionStore } from '@store/useMentionStore'
import Tippy from '@tippyjs/react/headless' // different import path!
import { useEditorRef } from '@udecode/plate'
import { mog } from '@utils/lib/helper'
import React, { useEffect, useMemo } from 'react'
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import { AccessLevel, InvitedUser, Mentionable, permissionOptions, SelfMention } from '../../../../types/mentions'
import { useHotkeys } from '../../tag/hooks/useHotkeys'
import { useOnMouseClick } from '../../tag/hooks/useOnMouseClick'
import {
  MentionTooltip,
  MentionTooltipContent,
  SMention,
  SMentionRoot,
  TooltipAlias,
  TooltipMail,
  Username
} from './MentionElement.styles'
import { useAuthStore } from '@services/auth/useAuth'
import { MentionElementProps } from './MentionElement.types'
import { useMentionStore } from '@store/useMentionStore'
import { useSpotlightContext } from '@store/Context/context.spotlight'
import { useUserService } from '@services/auth/useUserService'
import { useUserCacheStore } from '@store/useUserCacheStore'
import { usePermission } from '@services/auth/usePermission'
import toast from 'react-hot-toast'
import { Button } from '@style/Buttons'
import { Icon } from '@iconify/react'
import { useSnippetContext } from '@store/Context/context.snippet'
import { USER_ID_REGEX } from '@data/Defaults/auth'
// import { StyledCreatatbleSelect } from '@style/Form'
// import { UserDetails } from '../../../../types/auth'
// import toast from 'react-hot-toast'

interface MentionTooltipProps {
  user?: Mentionable | InvitedUser | SelfMention
  access?: AccessLevel
  hideAccess?: boolean
}

export const MentionTooltipComponent = ({ user, access, hideAccess }: MentionTooltipProps) => {
  const spotlightCtx = useSpotlightContext()
  const snippetCtx = useSnippetContext()

  // const addAccess = useMentionStore((s) => s.addAccess)
  // const { changeUserPermission } = usePermission()
  const prefillShareModal = useShareModalStore((state) => state.prefillModal)

  const onShareModal = async () => {
    // mog('onShareModal')
    // TODO: Extract new permission from Val
    if (user?.type === 'self') {
      toast('Changing your own permission is not allowed')
    }
    if (user?.type === 'mentionable') {
      prefillShareModal('invite', {
        userid: user?.userID
      })
    }
  }

  return (
    <MentionTooltip spotlight={spotlightCtx !== undefined}>
      <ProfileImage email={user && user.email} size={128} />
      <MentionTooltipContent>
        {user && user.type !== 'invite' && (
          <div>
            {user.name}
            {user.type === 'self' && '(you)'}
          </div>
        )}
        {user && user.alias && <TooltipAlias>@{user.alias}</TooltipAlias>}
        {/* <div>State: {user?.type ?? 'Missing'}</div> */}
        <TooltipMail>{user && user.email}</TooltipMail>
        {access && <AccessTag access={access} />}
        {user &&
          user?.type !== 'invite' &&
          user?.type !== 'self' &&
          snippetCtx === undefined &&
          !access &&
          !hideAccess && (
            <Button onClick={onShareModal}>
              <Icon icon="ri:share-line" />
              Share Note
            </Button>
          )}
      </MentionTooltipContent>
    </MentionTooltip>
  )
}

/**
 * MentionElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
export const MentionElement = ({ attributes, children, element }: MentionElementProps) => {
  const editor = useEditorRef()
  const selected = useSelected()
  const focused = useFocused()
  const node = useEditorStore((state) => state.node)
  const mentionable = useMentionStore((state) => state.mentionable)
  const cache = useUserCacheStore((state) => state.cache)
  const { getUserDetailsUserId } = useUserService()
  const { getUserFromUserid, getUserAccessLevelForNode } = useMentions()
  const snippetCtx = useSnippetContext()
  // const { getUserDetailsUserId } = useUserService()

  const onClickProps = useOnMouseClick(() => {
    mog('Mention has been clicked yo', { val: element.value, snippetCtx })
    // openTag(element.value)
  })

  const user = useMemo(() => {
    const u = getUserFromUserid(element.value)
    if (u) return u

    if (element.email)
      return {
        type: 'invite' as const,
        email: element.email,
        alias: element.value,
        // Invited user access map only needed for rendering, does not affect access as it is unknown (for 2nd person view)
        access: {}
      } as InvitedUser
  }, [element.value, mentionable, cache])

  useEffect(() => {
    const _f = (async () => {
      if (!user) {
        if (RegExp(USER_ID_REGEX).test(element.value)) {
          await getUserDetailsUserId(element.value)
        } //else mog('Not valid userid', { val: element.value })
      }
    })()
  }, [user])

  const access = snippetCtx !== undefined ? undefined : getUserAccessLevelForNode(element.value, node.nodeid)

  // mog('MentionElement', { user, access })

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor)
      }
    },
    [selected, focused]
  )

  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        // mog('delete', { selected, focused, sel: editor.selection })
        Transforms.move(editor, { reverse: true })
      }
    },
    [selected, focused]
  )

  // mog('MentionElement', { user, access, node, elementEmail: element?.email })

  return (
    <SMentionRoot {...attributes} type={user?.type} data-slate-value={element.value} contentEditable={false}>
      <Tippy
        // delay={[100, 1000000]} // for testing
        delay={500}
        // interactiveDebounce={100}
        interactive
        placement="bottom"
        appendTo={() => document.body}
        render={(attrs) => <MentionTooltipComponent user={user} access={access} />}
      >
        <SMention {...onClickProps} type={user?.type} selected={selected}>
          {user?.email && <ProfileImage email={user?.email} size={16} />}
          <Username>{user?.alias ?? element.value}</Username>
        </SMention>
      </Tippy>
      {children}
    </SMentionRoot>
  )
}
