import timeLine from '@iconify-icons/ri/time-line'
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react/headless' // different import path!
import React, { useEffect, useState } from 'react'
import { useLayoutStore } from '../../../store/useLayoutStore'
import styled, { css } from 'styled-components'
import { RelativeTime } from '../RelativeTime'
import { useContentStore } from '../../../store/useContentStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { Label } from '../../../style/Form'
import { CardShadow, HoverFade } from '../../../style/helpers'
import { ProfileIcon } from '../../../style/UserPage'
import { NodeMetadata } from '../../../types/data'
import { ProfileImageWithToolTip } from '../User/ProfileImage'
import { FOCUS_MODE_OPACITY } from '../../../style/consts'
import { FocusModeProp } from '../../../style/props'

// import user3Line from '@iconify-icons/ri/user-3-line'
// import { useRelativeTime } from '../../Hooks/useRelativeTime'
// import { CardShadow, HoverFade } from '../../Styled/helpers'
// import { NodeMetadata } from '../../Types/data'
// import { ProfileIcon } from '../../Styled/UserPage'
// import { useEditorStore } from '../../Editor/Store/EditorStore'
// import { useContentStore } from '../../Editor/Store/ContentStore'
// import styled, { css } from 'styled-components'
// import { Label } from '../../Styled/Form'

const Data = styled.div`
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

const DataGroup = styled.div``

export const MetadataWrapper = styled.div<FocusModeProp>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ theme }) => theme.spacing.small};

  margin-bottom: ${({ theme }) => theme.spacing.large};
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

  ${({ focusMode }) =>
    focusMode &&
    css`
      display: none;
      opacity: ${FOCUS_MODE_OPACITY};
      &:hover {
        opacity: 1;
      }
    `}

  ${Label} {
    color: ${({ theme }) => theme.colors.gray[6]};
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

const Metadata = () => {
  const node = useEditorStore((state) => state.node)
  const focusMode = useLayoutStore((s) => s.focusMode)
  const getContent = useContentStore((state) => state.getContent)
  const content = getContent(node.nodeid)
  const [metadata, setMetadata] = useState<NodeMetadata | undefined>(undefined)

  useEffect(() => {
    // console.log({ content })
    if (content === undefined || content.metadata === undefined) return
    const { metadata: contentMetadata } = content
    setMetadata(contentMetadata)
  }, [node, content])

  // console.log({ node, metadata })

  if (content === undefined || content.metadata === undefined || metadata === undefined) return null
  return (
    <MetadataWrapper focusMode={focusMode}>
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
