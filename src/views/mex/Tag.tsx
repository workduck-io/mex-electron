import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { debounce } from 'lodash'
import useDataStore from '../../store/useDataStore'
import { useTags } from '../../hooks/useTags'
import styled, { css } from 'styled-components'
import { useLinks } from '../../hooks/useLinks'
import { useTransition } from 'react-spring'
import { useContentStore } from '../../store/useContentStore'
import { Result, ResultHeader, Results, ResultTitle, SearchPreviewWrapper } from '../../style/Search'
import { defaultContent } from '../../data/Defaults/baseData'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import useLoad from '../../hooks/useLoad'
import { HoverSubtleGlow } from '../../style/helpers'
import { Input } from '../../style/Form'
import { fuzzySearch } from '../../utils/lib/fuzzySearch'

const TagsWrapper = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};

  ${Input} {
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }
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

const TagLink = styled(BaseLink)<{ active?: boolean; selected?: boolean }>`
  color: ${({ theme }) => theme.colors.text.fade};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  ${({ theme, active }) =>
    active &&
    css`
      background-color: ${theme.colors.gray[8]};
      color: ${theme.colors.primary};
    `}
  ${({ theme, selected }) =>
    selected &&
    css`
      background-color: ${theme.colors.gray[8]};
      box-shadow: 0 0 0px 1px ${({ theme }) => theme.colors.primary};
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
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(-1)
  const [tags, setTags] = useState(Object.keys(tagsCache))

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
    setSelected(-1)
    history.push(`/tag/${tag}`)
  }

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value)
  }

  const incSelected = () => setSelected((s: number) => (s > -1 ? s - 1 : tags.length - 1))
  const decSelected = () => setSelected((s: number) => (s < tags.length - 1 ? s + 1 : -1))

  const onKeyDownSearch: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === 'Tab') {
      e.preventDefault()
      // Blur the input if necessary (not needed currently)
      // if (inputRef.current) inputRef.current.blur()
      if (e.shiftKey) {
        incSelected()
      } else {
        decSelected()
      }
    }

    if (e.code === 'ArrowUp') {
      incSelected()
    }
    if (e.code === 'ArrowDown') {
      decSelected()
    }
    if (e.code === 'Escape') {
      setSelected(-1)
    }
    if (e.code === 'Enter') {
      // Only when the selected index is -1
      if (selected > -1 && selected < tags.length) {
        navigateToTag(tags[selected])
      }
    }
  }

  useEffect(() => {
    if (search && search !== '') {
      const filtered = fuzzySearch(Object.keys(tagsCache), search, {})
      setTags(filtered)
    }
    if (search === '') {
      setTags(Object.keys(tagsCache))
    }
  }, [search])

  return (
    <TagsWrapper>
      <TagsSidebar>
        <h1>Tags</h1>

        <Input
          placeholder="Filter tags"
          onChange={debounce((e) => onSearchChange(e), 250)}
          onKeyUp={debounce(onKeyDownSearch, 250)}
        />

        {tags.map((k, i) => {
          return (
            <TagLink
              active={k === tag}
              selected={selected === i}
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
            const content = con ? con.content : defaultContent.content
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