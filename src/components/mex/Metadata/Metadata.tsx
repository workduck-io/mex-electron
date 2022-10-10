import React, { useEffect, useState } from 'react'

import addCircleLine from '@iconify/icons-ri/add-circle-line'
import refreshLine from '@iconify/icons-ri/refresh-line'
import timeLine from '@iconify/icons-ri/time-line'
import { Icon } from '@iconify/react'
import { FadeInOut } from '@style/Layouts'
import { mog } from '@utils/lib/mog'
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
import { RelativeTime } from '../RelativeTime'
import { ProfileImageWithToolTip } from '../User/ProfileImage'

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
  fadeOnHover?: boolean
}
const Metadata = ({ node, fadeOnHover = true }: MetadataProps) => {
  // const node = useEditorStore((state) => state.node)
  const getContent = useContentStore((state) => state.getContent)
  const content = getContent(node.nodeid)
  const [metadata, setMetadata] = useState<NodeMetadata | undefined>(undefined)
  const isUserEditing = useEditorStore((store) => store.isEditing)

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

  // mog({ node, metadata })

  if (content === undefined || content.metadata === undefined || metadata === undefined || isEmpty) return null

  return (
    <MetadataWrapper fadeOnHover={fadeOnHover} isVisible={!isUserEditing}>
      <DataGroup>
        {metadata.createdBy !== undefined && (
          <DataWrapper interactive={metadata.createdAt !== undefined}>
            {metadata.createdBy !== undefined ? (
              <ProfileIcon>
                <ProfileImageWithToolTip props={{ userid: metadata.createdBy, size: 16 }} placement="bottom" />
              </ProfileIcon>
            ) : (
              <Icon icon={timeLine}></Icon>
            )}
            <div>
              {/*metadata.createdAt !== undefined ? <Label>Created</Label> : null*/}
              {metadata.createdAt !== undefined && (
                <Data>
                  <Icon icon={addCircleLine} width={16} />
                  <RelativeTime prefix="Created" dateNum={metadata.createdAt} />
                </Data>
              )}
            </div>
          </DataWrapper>
        )}
      </DataGroup>

      <DataGroup>
        {metadata.lastEditedBy !== undefined && (
          <DataWrapper interactive={metadata.updatedAt !== undefined}>
            {metadata.lastEditedBy !== undefined ? (
              <ProfileIcon data-title={metadata.lastEditedBy}>
                <ProfileImageWithToolTip props={{ userid: metadata.lastEditedBy, size: 16 }} placement="bottom" />
              </ProfileIcon>
            ) : (
              <Icon icon={timeLine}></Icon>
            )}
            <div>
              {/*metadata.updatedAt !== undefined ? <Label>Updated</Label> : null */}
              {metadata.updatedAt !== undefined && (
                <Data>
                  <Icon icon={refreshLine} width={16} />
                  <RelativeTime prefix="Updated" dateNum={metadata.updatedAt} />
                </Data>
              )}
            </div>
          </DataWrapper>
        )}
      </DataGroup>
    </MetadataWrapper>
  )
}

export default Metadata
