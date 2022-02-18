import hashtagIcon from '@iconify-icons/ri/hashtag'
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouting, ROUTE_PATHS, NavigationType } from '../../../views/routes/urls'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useTags } from '../../../hooks/useTags'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { HoverSubtleGlow } from '../../../style/helpers'
import { Note } from '../../../style/Typography'
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
  const nodeid = useEditorStore((state) => state.node.nodeid)
  const tagsCache = useDataStore((state) => state.tagsCache)
  const [relNodes, setRelNodes] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const { getNodeIdFromUid } = useLinks()
  const { push } = useNavigation()
  const { goTo } = useRouting()

  useEffect(() => {
    setRelNodes(getRelatedNodes(nodeid))
  }, [nodeid, tagsCache])

  useEffect(() => {
    setTags(getTags(nodeid))
  }, [nodeid, tagsCache])

  const navigateToTag = (tag: string) => {
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
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
                key={`info_tags_${nodeid}_${t}`}
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
            const path = getNodeIdFromUid(n)
            return path !== undefined ? (
              <NodeLink key={`info_tag_related_${nodeid}_${n}`} onClick={() => push(n)}>
                {path}
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
