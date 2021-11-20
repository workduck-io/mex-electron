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

const Data = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
`

interface DataWrapperProps {
  interactive?: boolean
}

const DataWrapper = styled.div<DataWrapperProps>`
  display: flex;
  align-items: center;

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

const MetadataWrapper = styled.div`
  ${HoverFade}
  ${Label} {
    color: ${({ theme }) => theme.colors.gray[6]};
    font-size: 1rem;
    margin: ${({ theme }) => theme.spacing.large} 0 ${({ theme }) => theme.spacing.small};
    margin-left: 1.25rem;
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
      placement="left"
      appendTo={() => document.body}
      render={(attrs) => (
        <DateTooptip tabIndex={-1} {...attrs}>
          {localDateString}
        </DateTooptip>
      )}
    >
      <DataWrapper interactive>
        <Icon icon={timeLine}></Icon>
        <Data>
          <Relative>{relTime}</Relative>
        </Data>
      </DataWrapper>
    </Tippy>
  )
}

const Metadata = () => {
  const node = useEditorStore((state) => state.node)
  const getContent = useContentStore((state) => state.getContent)
  const content = getContent(node.uid)
  const [metadata, setMetadata] = useState<NodeMetadata | undefined>(undefined)

  useEffect(() => {
    if (content === undefined || content.metadata === undefined) return
    const { metadata: contentMetadata } = content
    setMetadata(contentMetadata)
  }, [node, content])

  // console.log(node.uid, metadata)

  if (content === undefined || content.metadata === undefined || metadata === undefined) return null
  return (
    <MetadataWrapper>
      {metadata.createBy !== undefined || metadata.createdAt !== undefined ? <Label>Created</Label> : null}
      {metadata.createBy !== undefined && (
        <DataWrapper>
          <Icon icon={user3Line}></Icon>
          <Data>{metadata.createBy}</Data>
        </DataWrapper>
      )}
      {metadata.createdAt !== undefined && <RelDateWithPreview n={metadata.createdAt} />}

      {metadata.updatedAt !== undefined || metadata.lastEditedBy !== undefined ? <Label>Updated</Label> : null}
      {metadata.lastEditedBy !== undefined && (
        <DataWrapper>
          <Icon icon={user3Line}></Icon>
          <Data>{metadata.lastEditedBy}</Data>
        </DataWrapper>
      )}
      {metadata.updatedAt !== undefined && <RelDateWithPreview n={metadata.updatedAt} />}
    </MetadataWrapper>
  )
}

export default Metadata
