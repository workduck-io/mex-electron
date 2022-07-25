import React from 'react'
import { useParams } from 'react-router-dom'
import { useTransition } from 'react-spring'
import styled from 'styled-components'
import { View } from '../../components/mex/Search/ViewSelector'
import { defaultContent } from '../../data/Defaults/baseData'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import { useLinks } from '../../hooks/useLinks'
import useLoad from '../../hooks/useLoad'
import { useTags } from '../../hooks/useTags'
import { useContentStore } from '../../store/useContentStore'
import { Input } from '../../style/Form'
import { Result, ResultHeader, Results, ResultTitle, SearchPreviewWrapper } from '../../style/Search'
import { NavigationType, ROUTE_PATHS, useRouting } from '../routes/urls'

const TagsWrapper = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};

  ${Input} {
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }
`

const TagMain = styled.div`
  flex: 4;
`

const Tag = () => {
  const contents = useContentStore((store) => store.contents)
  const { tag } = useParams<{ tag: string }>()
  // const tagsCache = useDataStore((store) => store.tagsCache)
  const { getNodesAndCleanCacheForTag } = useTags()
  const { getPathFromNodeid } = useLinks()
  const { nodes } = getNodesAndCleanCacheForTag(tag)
  const { goTo } = useRouting()
  const { loadNode } = useLoad()

  const transition = useTransition(nodes, {
    // sort: (a, b) => (a.score > b.score ? -1 : 0),
    keys: (item) => `${tag}_${item}`,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    trail: 50,
    duration: 200,
    config: {
      mass: 1,
      tension: 200,
      friction: 16
    }
  })

  return (
    <TagsWrapper>
      <TagMain>
        <h1>#{tag}</h1>
        <p>Notes with tag</p>
        <Results view={View.Card}>
          {transition((styles, nodeid, _t, _i) => {
            const con = contents[nodeid]
            const path = getPathFromNodeid(nodeid, true)
            const content = con ? con.content : defaultContent.content
            return (
              <Result
                onClick={() => {
                  loadNode(nodeid)
                  goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
                }}
                style={styles}
                view={View.Card}
                key={`tag_res_prev_${tag}_${nodeid}${_i}`}
              >
                <ResultHeader>
                  <ResultTitle>{path}</ResultTitle>
                </ResultHeader>
                <SearchPreviewWrapper>
                  <EditorPreviewRenderer content={content} editorId={`editor_${tag}_preview_${nodeid}`} />
                </SearchPreviewWrapper>
              </Result>
            )
          })}
        </Results>
      </TagMain>
    </TagsWrapper>
  )
}

export default Tag
