import React, { useEffect, useState } from 'react'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { useContentStore } from '../../Editor/Store/ContentStore'
import styled, { css } from 'styled-components'
import { Label } from '../../Styled/Form'
import { Icon } from '@iconify/react'
import timeLine from '@iconify-icons/ri/time-line'
import user3Line from '@iconify-icons/ri/user-3-line'
import { useRelativeTime } from '../../Hooks/useRelativeTime'
import { CardShadow, HoverFade } from '../../Styled/helpers'
import { NodeMetadata } from '../../Types/data'
import Tippy from '@tippyjs/react/headless' // different import path!
import { ProfileIcon } from '../../Styled/UserPage'
import { ProfileImage, ProfileImageWithToolTip } from '../User/ProfileImage'

const Data = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
`

interface DataWrapperProps {
  interactive?: boolean
}

const DataWrapper = styled.div<DataWrapperProps>`
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

const MetadataWrapper = styled.div`
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

const RelDateWithPreview = ({ n }: RelDateWithPreviewProps) => {
  const [date, setDate] = useState(new Date(n))
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  } as const

  useEffect(() => {
    setDate(new Date(n))
  }, [n])

  const relTime = useRelativeTime(date)
  const localDateString = date.toLocaleString('en-US', options)

  return (
    <Tippy
      delay={100}
      interactiveDebounce={100}
      placement="bottom"
      appendTo={() => document.body}
      render={(attrs) => (
        <DateTooptip tabIndex={-1} {...attrs}>
          {localDateString}
        </DateTooptip>
      )}
    >
      <Data>
        <Relative>{relTime}</Relative>
      </Data>
    </Tippy>
  )
}

const Metadata = () => {
  const node = useEditorStore((state) => state.node)
  const getContent = useContentStore((state) => state.getContent)
  const content = getContent(node.uid)
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
    <MetadataWrapper>
      {node.uid}
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
              {metadata.createdAt !== undefined && <RelDateWithPreview n={metadata.createdAt} />}
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
              {metadata.updatedAt !== undefined && <RelDateWithPreview n={metadata.updatedAt} />}
            </div>
          </DataWrapper>
        )}
      </DataGroup>
    </MetadataWrapper>
  )
}

export default Metadata
