import React, { useEffect, useState } from 'react'

import hashtagIcon from '@iconify/icons-ri/hashtag'
import { useSpotlightContext } from '@store/Context/context.spotlight'

import { TagsHelp } from '../../../data/Defaults/helpText'
import { useTags } from '../../../hooks/useTags'
import { useAnalysisStore } from '../../../store/useAnalysis'
import useDataStore from '../../../store/useDataStore'
import { Note } from '../../../style/Typography'
import { InfoWidgetWrapper } from '../../../style/infobar'
import Collapse from '../../../ui/layout/Collapse/Collapse'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import NodeLink from '../NodeLink/NodeLink'
import { TagsFlex, TagFlex, InfoSubHeading } from './TagsRelated.styles'

interface TagsRelated {
  nodeid: string
  fromAnalysis?: boolean
}

const TagsRelated = ({ nodeid, fromAnalysis }: TagsRelated) => {
  const { getRelatedNodes, getTags } = useTags()
  const tagsCache = useDataStore((state) => state.tagsCache)
  const analysisTags = useAnalysisStore((state) => state.analysis.tags)
  const [relNodes, setRelNodes] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const { goTo } = useRouting()

  useEffect(() => {
    setRelNodes(getRelatedNodes(nodeid, fromAnalysis))
  }, [nodeid, tagsCache, analysisTags])

  useEffect(() => {
    setTags(getTags(nodeid, fromAnalysis))
  }, [nodeid, tagsCache, analysisTags])

  const navigateToTag = (tag: string) => {
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  // mog('TagsRelated', { nodeid, relNodes, tags, analysisTags })

  return (
    <InfoWidgetWrapper>
      <Collapse
        icon={hashtagIcon}
        infoProps={{
          text: TagsHelp
        }}
        title="Tags"
        defaultOpen
        maximumHeight="40vh"
      >
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
            {relNodes.length > 0 ? <InfoSubHeading>Related Notes</InfoSubHeading> : null}
            {relNodes.map((n) => (
              <NodeLink key={`info_tag_related_${nodeid}_${n}`} keyStr={`info_tag_related_${nodeid}_${n}`} nodeid={n} />
            ))}
          </>
        ) : (
          <>
            <Note>No Tags found.</Note>
            <Note>Create Tags with # view them and related Notes here.</Note>
          </>
        )}
      </Collapse>
    </InfoWidgetWrapper>
  )
}

export const TagsRelatedTiny = ({ nodeid }: TagsRelated) => {
  const { getTags } = useTags()
  const tagsCache = useDataStore((state) => state.tagsCache)
  const [tags, setTags] = useState<string[]>([])
  const { goTo } = useRouting()
  const isSpotlight = useSpotlightContext()

  useEffect(() => {
    setTags(getTags(nodeid))
  }, [nodeid, tagsCache])

  const navigateToTag = (tag: string) => {
    if (isSpotlight) return
    goTo(ROUTE_PATHS.tag, NavigationType.push, tag)
  }

  // mog('TagsRelated', { nodeid, tags })

  return tags.length > 0 ? (
    <TagsFlex>
      {tags.map((t) => (
        <TagFlex
          key={`info_tags_${nodeid}_${t}`}
          onClick={(e) => {
            e.preventDefault()
            navigateToTag(t)
          }}
          isDisabled={!!isSpotlight}
        >
          #{t}
        </TagFlex>
      ))}
    </TagsFlex>
  ) : null
}

export default TagsRelated
