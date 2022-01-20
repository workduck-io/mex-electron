import hashtagIcon from '@iconify-icons/ri/hashtag'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useTags } from '../../../hooks/useTags'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { HoverSubtleGlow } from '../../../style/helpers'
import { Note } from '../../../style/Typography'
import styled from 'styled-components'
import { DataInfoHeader, NodeLink } from '../Backlinks'

const TagFlex = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  color: ${({ theme }) => theme.colors.text.fade};
  margin-right: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.small};

  ${HoverSubtleGlow}
`

const TagsFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const TagsInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 3rem 0;
`

const InfoSubHeading = styled.h2`
  margin: ${({ theme }) => theme.spacing.large} 0 ${({ theme }) => theme.spacing.medium}
    ${({ theme }) => theme.spacing.medium};
  font-size: 1.2rem;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.fade};
`

const TagsRelated = () => {
  const { getRelatedNodes, getTags } = useTags()
  const uid = useEditorStore((state) => state.node.uid)
  const tagsCache = useDataStore((state) => state.tagsCache)
  const [relNodes, setRelNodes] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const { getNodeIdFromUid } = useLinks()
  const { push } = useNavigation()
  const history = useHistory()

  useEffect(() => {
    setRelNodes(getRelatedNodes(uid))
  }, [uid, tagsCache])

  useEffect(() => {
    setTags(getTags(uid))
  }, [uid, tagsCache])

  const navigateToTag = (tag: string) => {
    history.push(`/tag/${tag}`)
  }

  // console.log({ relNodes })

  return (
    <TagsInfoWrapper>
      <DataInfoHeader>
        <Icon icon={hashtagIcon}></Icon>
        Tags
      </DataInfoHeader>
      {tags.length > 0 ? (
        <>
          <TagsFlex>
            {tags.map((t) => (
              <TagFlex
                key={`info_tags_${uid}_${t}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigateToTag(t)
                }}
              >
                #{t}
              </TagFlex>
            ))}
          </TagsFlex>
          {relNodes.length > 0 ? <InfoSubHeading>Related Nodes</InfoSubHeading> : null}
          {relNodes.map((n) => {
            const nodeid = getNodeIdFromUid(n)
            return nodeid !== undefined ? (
              <NodeLink key={`info_tag_related_${uid}_${n}`} onClick={() => push(n)}>
                {nodeid}
              </NodeLink>
            ) : null
          })}
        </>
      ) : (
        <>
          <Note>No Tags found.</Note>
          <Note>Create tags with # view them and related nodes here.</Note>
        </>
      )}
    </TagsInfoWrapper>
  )
}

export default TagsRelated
