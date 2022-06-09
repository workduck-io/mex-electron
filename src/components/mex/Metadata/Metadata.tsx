import timeLine from '@iconify/icons-ri/time-line'
import { Icon } from '@iconify/react'
import { mog } from '@utils/lib/helper'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import useLayout from '../../../hooks/useLayout'
import { useContentStore } from '../../../store/useContentStore'
import { NodeProperties } from '../../../store/useEditorStore'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { focusStyles } from '../../../style/focus'
import { Label } from '../../../style/Form'
import { CardShadow, HoverFade } from '../../../style/helpers'
import { FocusModeProp } from '../../../style/props'
import { ProfileIcon } from '../../../style/UserPage'
import { NodeMetadata } from '../../../types/data'
import { RelativeTime } from '../RelativeTime'
import { ProfileImageWithToolTip } from '../User/ProfileImage'

export const Data = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
`

interface DataWrapperProps {
  interactive?: boolean
}

export const DataWrapper = styled.div<DataWrapperProps>`
  display: flex;
  align-items: center;

  ${ProfileIcon} {
    margin: 0;
  }

  svg {
    color: ${({ theme }) => theme.colors.gray[7]};
    margin-right: ${({ theme }) => theme.spacing.small};
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
}
export const MetadataWrapper = styled.div<MetaDataWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: flex-end;

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
  const focusMode = useLayoutStore((s) => s.focusMode)
  const getContent = useContentStore((state) => state.getContent)
  const content = getContent(node.nodeid)
  const { getFocusProps } = useLayout()
  const [metadata, setMetadata] = useState<NodeMetadata | undefined>(undefined)

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
    <MetadataWrapper {...getFocusProps(focusMode)} fadeOnHover={fadeOnHover}>
      <DataGroup>
        {metadata.createdBy !== undefined && (
          <DataWrapper interactive={metadata.createdAt !== undefined}>
            {metadata.createdBy !== undefined ? (
              <ProfileIcon>
                <ProfileImageWithToolTip props={{ email: metadata.createdBy, size: 32 }} placement="bottom" />
              </ProfileIcon>
            ) : (
              <Icon icon={timeLine}></Icon>
            )}
            <div>
              {metadata.createdAt !== undefined ? <Label>Created</Label> : null}
              {metadata.createdAt !== undefined && (
                <Data>
                  <RelativeTime dateNum={metadata.createdAt} />
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
                <ProfileImageWithToolTip props={{ email: metadata.lastEditedBy, size: 32 }} placement="bottom" />
              </ProfileIcon>
            ) : (
              <Icon icon={timeLine}></Icon>
            )}
            <div>
              {metadata.updatedAt !== undefined ? <Label>Updated</Label> : null}
              {metadata.updatedAt !== undefined && (
                <Data>
                  <RelativeTime dateNum={metadata.updatedAt} />
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
