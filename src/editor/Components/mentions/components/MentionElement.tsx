import AccessTag from '@components/mex/Mention/AccessTag'
import { ProfileImage } from '@components/mex/User/ProfileImage'
import { useMentions } from '@hooks/useMentions'
import { usePermission } from '@services/auth/usePermission'
import { useEditorStore } from '@store/useEditorStore'
import { useMentionStore } from '@store/useMentionStore'
import Tippy from '@tippyjs/react/headless' // different import path!
import { useEditorRef } from '@udecode/plate'
import { mog } from '@utils/lib/helper'
import React from 'react'
import { Transforms } from 'slate'
import { useFocused, useSelected } from 'slate-react'
import { AccessLevel, InvitedUser, Mentionable, permissionOptions } from '../../../../types/mentions'
import { useHotkeys } from '../../tag/hooks/useHotkeys'
import { useOnMouseClick } from '../../tag/hooks/useOnMouseClick'
import { MentionTooltip, SMention, SMentionRoot, TooltipMail, Username } from './MentionElement.styles'
import { MentionElementProps } from './MentionElement.types'
import { StyledCreatatbleSelect } from '@style/Form'

interface MentionTooltipProps {
  user?: Mentionable | InvitedUser
  nodeid: string
  access?: AccessLevel
}

const MentionTooltipComponent = ({ user, access, nodeid }: MentionTooltipProps) => {
  const addAccess = useMentionStore((s) => s.addAccess)
  const { changeUserPermission } = usePermission()
  const onAccessChange = async (val: any) => {
    mog('Val', val)
    // TODO: Extract new permission from Val
    if (user.type === 'mentionable') {
      // Grant permission via api
      const resp = await changeUserPermission(nodeid, { [user.userid]: access }) // Use new permission instead of acces here
    }
    addAccess(user.email, nodeid, access)
  }
  return (
    <MentionTooltip>
      <ProfileImage email={user && user.email} size={64} />
      <div>{user && user.alias}</div>
      {/* <div>State: {user?.type ?? 'Missing'}</div> */}
      {access && <AccessTag access={access} />}
      {access && (
        <StyledCreatatbleSelect
          defaultValue={permissionOptions.find((p) => p.value === access)}
          options={permissionOptions}
          onChange={(val) => onAccessChange(val)}
          closeMenuOnSelect={true}
          closeMenuOnBlur={true}
        />
      )}
      <TooltipMail>{user && user.email}</TooltipMail>
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
  const { getUserFromUserid, getUserAccessLevelForNode } = useMentions()

  const onClickProps = useOnMouseClick(() => {
    mog('Mention has been clicked yo', { val: element.value })
    // openTag(element.value)
  })

  const user = getUserFromUserid(element.value)
  const access = getUserAccessLevelForNode(element.value, node.nodeid)

  // mog('MentionElement', { user })

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

  // mog('MentionElement', { user, access, node })

  return (
    <SMentionRoot {...attributes} data-slate-value={element.value} contentEditable={false}>
      <Tippy
        delay={100}
        interactiveDebounce={100}
        placement="bottom"
        appendTo={() => document.body}
        render={(attrs) => <MentionTooltipComponent user={user} nodeid={node.nodeid} access={access} />}
      >
        <SMention {...onClickProps} selected={selected}>
          <Username>@{user?.alias ?? element.value}</Username>
        </SMention>
      </Tippy>
      {children}
    </SMentionRoot>
  )
}
