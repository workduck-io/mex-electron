import React from 'react'
import { defaultContent } from '../../../data/Defaults/baseData'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import { useLinks } from '../../../hooks/useLinks'
import useLoad from '../../../hooks/useLoad'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { GenericSearchResult, useSearchStore } from '../../../store/useSearchStore'
import { Result, ResultHeader, ResultTitle, SearchContainer, SearchPreviewWrapper } from '../../../style/Search'
import { Title } from '../../../style/Typography'
import { mog } from '../../../utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import SearchView, { RenderItemProps } from './SearchView'

const Search = () => {
  const { loadNode } = useLoad()
  const searchIndex = useSearchStore((store) => store.searchIndex)
  const contents = useContentStore((store) => store.contents)
  const { goTo } = useRouting()

  const { getNodeIdFromUid } = useLinks()

  const onSearch = (newSearchTerm: string) => {
    try {
      const res = searchIndex('node', newSearchTerm)
      mog('search', { res })
      return res
    } catch (e) {
      mog('Search broke', { e })
      return []
    }
  }

  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const nodeUID = useEditorStore((store) => store.node.nodeid)
  const baseNodeId = useDataStore((store) => store.baseNodeId)

  // console.log({ result })
  const onSelect = (item: GenericSearchResult) => {
    const nodeid = item.id
    loadNode(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const onEscapeExit = () => {
    const nodeid = nodeUID ?? lastOpened[0] ?? baseNodeId
    loadNode(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  // Forwarding ref to focus on the selected result
  const BaseItem = ({ item, ...props }: RenderItemProps<GenericSearchResult>, ref: React.Ref<HTMLDivElement>) => {
    const con = contents[item.id]
    const path = getNodeIdFromUid(item.id)
    const content = con ? con.content : defaultContent.content
    return (
      <Result {...props} ref={ref}>
        <ResultHeader active={item.matchField.includes('title')}>
          <ResultTitle>{path}</ResultTitle>
        </ResultHeader>
        <SearchPreviewWrapper active={item.matchField.includes('text')}>
          <EditorPreviewRenderer content={content} editorId={`editor_${item.id}`} />
        </SearchPreviewWrapper>
      </Result>
    )
  }
  const RenderItem = React.forwardRef(BaseItem)

  return (
    <SearchContainer>
      <Title>Search</Title>
      <SearchView
        id="searchStandard"
        initialItems={[]}
        getItemKey={(i) => i.id}
        onSelect={onSelect}
        onEscapeExit={onEscapeExit}
        onSearch={onSearch}
        RenderItem={RenderItem}
      />
    </SearchContainer>
  )
}

export default Search
