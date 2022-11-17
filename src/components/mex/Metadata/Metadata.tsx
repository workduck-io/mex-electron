import React, { useEffect, useMemo, useState } from 'react'

import { useMentions } from '@hooks/useMentions'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import refreshLine from '@iconify/icons-ri/refresh-line'
import timeLine from '@iconify/icons-ri/time-line'
import { Icon } from '@iconify/react'
import { useMentionStore } from '@store/useMentionStore'
import useRouteStore from '@store/useRouteStore'
import { FadeInOut, MexIcon } from '@style/Layouts'
import { getContent } from '@utils/helpers'
import { mog } from '@utils/lib/mog'
import { useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'

import useLayout from '../../../hooks/useLayout'
import { useContentStore } from '../../../store/useContentStore'
import { NodeProperties, useEditorStore } from '../../../store/useEditorStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { Label } from '../../../style/Form'
import { ProfileIcon } from '../../../style/UserPage'
import { focusStyles } from '../../../style/focus'
import { CardShadow, HoverFade } from '../../../style/helpers'
import { FocusModeProp } from '../../../style/props'
import { NodeMetadata } from '../../../types/data'
import { useShareModalStore } from '../Mention/ShareModalStore'
import { RelativeTime } from '../RelativeTime'
import { ProfileImageWithToolTip } from '../User/ProfileImage'
import AvatarGroups from '@components/AvatarGroups'
import { Menu, MenuItem } from '@components/FloatingElements/Dropdown'
import { FlexBetween } from '@components/spotlight/Actions/styled'

export const Data = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.tiny};
  align-items: center;
  color: ${({ theme }) => theme.colors.text.fade};
`

interface DataWrapperProps {
  interactive?: boolean
}

export const DataWrapper = styled.div<DataWrapperProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  ${ProfileIcon} {
    margin: 0;
    .defaultProfileIcon {
      padding: 0.2rem;
    }
  }

  svg {
    color: ${({ theme }) => theme.colors.gray[7]};
  }

  svg,
  img {
    box-shadow: none;
  }

  ${({ theme, interactive }) =>
    interactive &&
    css`
      &:hover {
        color: ${theme.colors.text.heading};
        svg {
          color: ${theme.colors.primary};
        }
      }
    `}
`

export const DataGroup = styled.div``

interface MetaDataWrapperProps extends FocusModeProp {
  fadeOnHover?: boolean
  isVisible?: boolean
}

export const MetadataWrapper = styled.div<MetaDataWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.large};

  ${({ theme, fadeOnHover }) =>
    fadeOnHover &&
    css`
      ${HoverFade}
      ${ProfileIcon} {
        filter: grayscale(1);
        opacity: 0.5;
      }
      &:hover {
        ${ProfileIcon} {
          filter: grayscale(0);
          opacity: 1;
        }
      }
    `}

  ${(props) => focusStyles(props)}

  ${Label} {
    color: ${({ theme }) => theme.colors.gray[5]};
    font-size: 0.9rem;
    margin: 0 0 0.2rem;
  }

  ${DataGroup}:first-child {
    margin-right: calc(2 * ${({ theme }) => theme.spacing.large});
  }
  ${DataWrapper}:not(:first-child) {
    margin-top: ${({ theme }) => theme.spacing.small};
  }

  ${({ isVisible }) => FadeInOut(isVisible)}
`

interface RelDateWithPreviewProps {
  n: number
}

const Relative = styled.div`
  &:hover {
  }
`

const DateTooptip = styled.div`
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  max-height: 400px;
  max-width: 700px;
  overflow-y: auto;
  ${CardShadow}
  background: ${({ theme }) => theme.colors.gray[8]} !important;
  color: ${({ theme }) => theme.colors.text.default};
  &::after {
    border-right-color: ${({ theme }) => theme.colors.primary} !important;
  }
`

interface MetadataProps {
  node: NodeProperties
  namespaceId: string
  fadeOnHover?: boolean
  publicMetadata?: NodeMetadata
  hideShareDetails?: boolean
}
const Metadata = ({
  node,
  namespaceId,
  hideShareDetails = false,
  fadeOnHover = true,
  publicMetadata // have included publicMetadata just like that wasn't sure if its the correct way or not
}: MetadataProps) => {
  // const node = useEditorStore((state) => state.node)
  const getContent = useContentStore((state) => state.getContent)
  const location = useLocation()
  const content = getContent(node.nodeid)
  const openShareModal = useShareModalStore((store) => store.openModal)
  const [metadata, setMetadata] = useState<NodeMetadata | undefined>(undefined)
  const isUserEditing = useEditorStore((store) => store.isEditing)
  const mentionable = useMentionStore((s) => s.mentionable)
  const activeUsers = useRouteStore.getState().routes[location.pathname]?.users ?? []
  const { getSharedUsersForNode } = useMentions()

  const isEmpty =
    metadata &&
    metadata.createdAt === undefined &&
    metadata.createdBy === undefined &&
    metadata.updatedAt === undefined &&
    metadata.lastEditedBy === undefined

  useEffect(() => {
    // mog({ content })
    if (content === undefined || content.metadata === undefined) return
    const { metadata: contentMetadata } = content
    setMetadata(contentMetadata)
  }, [node, content])

  mog('ACTIVE USERS', { activeUsers, mentionable })

  const sharedUsers = useMemo(() => {
    const sharedUsersOfNode = getSharedUsersForNode(node.id)

    return sharedUsersOfNode
      .map((user) => ({ userId: user.userID, active: activeUsers.includes(user.userID) }))
      .sort((a, b) => Number(a.active) - Number(b.active))
  }, [location, activeUsers, mentionable, node.id])

  // mog({ node, metadata })

  if (content === undefined || content.metadata === undefined || metadata === undefined || isEmpty) return null

  return (
    <MetadataWrapper fadeOnHover={fadeOnHover} isVisible={!isUserEditing}>
      <FlexBetween>
        <DataGroup>
          {metadata.lastEditedBy !== undefined && (
            <DataWrapper interactive={metadata.updatedAt !== undefined}>
              {metadata.lastEditedBy !== undefined && !publicMetadata ? ( // publicMetadata needs to be added to the function params
                <ProfileIcon data-title={metadata.lastEditedBy}>
                  <ProfileImageWithToolTip props={{ userid: metadata.lastEditedBy, size: 16 }} placement="bottom" />
                </ProfileIcon>
              ) : (
                <MexIcon noHover height={20} width={20} icon={timeLine}></MexIcon>
              )}
              <div>
                {metadata.updatedAt !== undefined && (
                  <Data>
                    <RelativeTime prefix="Last Edited" dateNum={metadata.updatedAt} />
                  </Data>
                )}
              </div>
            </DataWrapper>
          )}
        </DataGroup>
        {!publicMetadata && ( // publicMetadata needs to be added to the function params
          <Data>
            <AvatarGroups users={sharedUsers} limit={5} margin="0 1.5rem 0" />
            <Menu values={<MexIcon noHover icon="bi:three-dots-vertical" width={20} height={20} />}>
              <MenuItem
                key="share-menu"
                icon={{ type: 'ICON', value: 'ri:share-line' }}
                onClick={() => openShareModal('permission', node.id)}
                label="Share"
              />
            </Menu>
          </Data>
        )}
      </FlexBetween>
    </MetadataWrapper>
  )
}

export default Metadata
