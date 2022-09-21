import NamespaceTag from '@components/mex/NamespaceTag'
import { useNamespaces } from '@hooks/useNamespaces'
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
  const { getILinkFromNodeid } = useLinks()
  const { nodes } = getNodesAndCleanCacheForTag(tag)
  const { goTo } = useRouting()
  const { loadNode } = useLoad()
  const { getNamespace } = useNamespaces()

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
            const node = getILinkFromNodeid(nodeid, true)
            const content = con ? con.content : defaultContent.content
            const namespace = getNamespace(node?.namespace)
            return (
              <Result
                onClick={(ev) => {
                  loadNode(nodeid)
                  goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
                }}
                style={styles}
                view={View.Card}
                key={`tag_res_prev_${tag}_${nodeid}${_i}`}
              >
                <ResultHeader>
                  <ResultTitle>{node?.path}</ResultTitle>
                  <NamespaceTag namespace={namespace} />
                </ResultHeader>
                <SearchPreviewWrapper>
                  <EditorPreviewRenderer content={content} editorId={`${nodeid}_editor_${tag}_preview`} />
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
