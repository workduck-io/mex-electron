import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import useDataStore from '../Editor/Store/DataStore'
import { useTags } from '../Hooks/useTags/useTags'
import styled, { css } from 'styled-components'
import { useLinks } from '../Editor/Actions/useLinks'
import { useTransition } from 'react-spring'
import { useContentStore } from '../Editor/Store/ContentStore'
import { Result, ResultHeader, Results, ResultTitle, SearchPreviewWrapper } from '../Styled/Search'
import { defaultContent } from '../Defaults/baseData'
import EditorPreviewRenderer from '../Editor/EditorPreviewRenderer'
import useLoad from '../Hooks/useLoad/useLoad'
import { HoverSubtleGlow } from '../Styled/helpers'

const TagsWrapper = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};
`

const TagsSidebar = styled.div`
  flex-grow: 0;
  min-width: 200px;
  max-width: 300px;
  margin-right: ${({ theme }) => theme.spacing.large};
`

const TagMain = styled.div`
  flex: 4;
`

export const BaseLink = styled.div`
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  margin-bottom: ${({ theme }) => theme.spacing.small};

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0px 2px 6px ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
  }
  ${HoverSubtleGlow}
`

const TagLink = styled(BaseLink)<{ selected?: boolean }>`
  color: ${({ theme }) => theme.colors.text.fade};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  ${({ theme, selected }) =>
    selected &&
    css`
      background-color: ${theme.colors.gray[8]};
      color: ${theme.colors.primary};
    `}
`

const Tag = () => {
  const contents = useContentStore((store) => store.contents)
  const { tag } = useParams<{ tag: string }>()
  const tagsCache = useDataStore((store) => store.tagsCache)
  const { getNodesForTag } = useTags()
  const { getNodeIdFromUid } = useLinks()
  const nodes = getNodesForTag(tag)
  const history = useHistory()
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

  const navigateToTag = (tag: string) => {
    history.push(`/tag/${tag}`)
  }

  return (
    <TagsWrapper>
      <TagsSidebar>
        <h1>Tags</h1>
        {Object.keys(tagsCache).map((k) => {
          return (
            <TagLink
              selected={k === tag}
              key={`tags_sidebar_${tag}_${k}`}
              onClick={(e) => {
                e.preventDefault()
                navigateToTag(k)
              }}
            >
              #{k}
            </TagLink>
          )
        })}
      </TagsSidebar>
      <TagMain>
        <h1>#{tag}</h1>
        <p>Nodes with tag</p>
        <Results>
          {transition((styles, n, _t, _i) => {
            const con = contents[n]
            const nodeId = getNodeIdFromUid(n)
            const content = con ? con.content : defaultContent
            return (
              <Result
                onClick={() => {
                  loadNode(n)
                  history.push('/editor')
                }}
                style={styles}
                key={`tag_res_prev_${tag}_${n}${_i}`}
              >
                <ResultHeader>
                  <ResultTitle>{nodeId}</ResultTitle>
                </ResultHeader>
                <SearchPreviewWrapper>
                  <EditorPreviewRenderer content={content} editorId={`editor_${tag}_preview_${n}`} />
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
