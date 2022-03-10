import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { defaultContent } from '../../../data/Defaults/baseData'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import { useFilters } from '../../../hooks/useFilters'
import { useLinks } from '../../../hooks/useLinks'
import useLoad from '../../../hooks/useLoad'
import { useNodes } from '../../../hooks/useNodes'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { GenericSearchResult, useSearchStore } from '../../../store/useSearchStore'
import { MainHeader } from '../../../style/Layouts'
import {
  Result,
  ResultDesc,
  ResultHeader,
  ResultMain,
  ResultMetaData,
  ResultRow,
  ResultTitle,
  SearchContainer,
  SearchPreviewWrapper,
  SplitSearchPreviewWrapper
} from '../../../style/Search'
import { Title } from '../../../style/Typography'
import { SplitType } from '../../../ui/layout/splitView'
import { getInitialNode } from '../../../utils/helpers'
import { mog } from '../../../utils/lib/helper'
import { convertContentToRawText } from '../../../utils/search/localSearch'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import Backlinks from '../Backlinks'
import Metadata from '../Metadata/Metadata'
import TagsRelated from '../Tags/TagsRelated'
import SearchFilters from './SearchFilters'
import SearchView, { RenderFilterProps, RenderItemProps, RenderPreviewProps } from './SearchView'
import { View } from './ViewSelector'

const Search = () => {
  const { loadNode } = useLoad()
  const searchIndex = useSearchStore((store) => store.searchIndex)
  const contents = useContentStore((store) => store.contents)
  const ilinks = useDataStore((store) => store.ilinks)
  const initialResults = ilinks
    .map(
      (link): GenericSearchResult => ({
        id: link.nodeid,
        title: link.path
      })
    )
    .slice(0, 12)
  const { getNode } = useNodes()
  const { goTo } = useRouting()
  const {
    applyCurrentFilters,
    resetFilters,
    addCurrentFilter,
    setFilters,
    generateNodeSearchFilters,
    removeCurrentFilter,
    filters,
    currentFilters,
    resetCurrentFilters
  } = useFilters<GenericSearchResult>()

  const { getNodeIdFromUid } = useLinks()

  const onSearch = (newSearchTerm: string) => {
    const res = searchIndex('node', newSearchTerm)
    const nodeids = useDataStore.getState().ilinks.map((l) => l.nodeid)
    const filRes = res.filter((r) => nodeids.includes(r.id))
    // mog('search', { res, filRes })
    return filRes
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
  const BaseItem = (
    { item, splitOptions, ...props }: RenderItemProps<GenericSearchResult>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const node = getNode(item.id)
    // mog('Baseitem', { item, node })
    if (!item || !node) {
      return <Result {...props} ref={ref}></Result>
    }
    const con = contents[item.id]
    const content = con ? con.content : defaultContent.content
    const icon = node?.icon ?? fileList2Line
    const edNode = node ? { ...node, title: node.path, id: node.nodeid } : getInitialNode()
    const id = `${item.id}_ResultFor_Search`
    if (props.view === View.Card) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultHeader active={item.matchField?.includes('title')}>
            <ResultTitle>{node.path}</ResultTitle>
          </ResultHeader>
          <SearchPreviewWrapper active={item.matchField?.includes('text')}>
            <EditorPreviewRenderer content={content} editorId={`editor_${item.id}`} />
          </SearchPreviewWrapper>
        </Result>
      )
    } else if (props.view === View.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
            <Icon icon={icon} />
            <ResultMain>
              <ResultTitle>{node.path}</ResultTitle>
              <ResultDesc>{convertContentToRawText(content, ' ')}</ResultDesc>
            </ResultMain>
            {(!splitOptions || splitOptions.type === SplitType.NONE) && (
              <ResultMetaData>
                <Metadata fadeOnHover={false} node={edNode} />
              </ResultMetaData>
            )}
          </ResultRow>
        </Result>
      )
    }
  }
  const RenderItem = React.forwardRef(BaseItem)

  const filterResults = (results: GenericSearchResult[]): GenericSearchResult[] => {
    const nFilters = generateNodeSearchFilters(results)
    setFilters(nFilters)
    const filtered = applyCurrentFilters(results)
    mog('filtered', { filtered, nFilters, currentFilters, results })
    return filtered
  }

  const RenderFilters = (props: RenderFilterProps<GenericSearchResult>) => {
    return (
      <SearchFilters
        {...props}
        addCurrentFilter={addCurrentFilter}
        removeCurrentFilter={removeCurrentFilter}
        resetCurrentFilters={resetCurrentFilters}
        filters={filters}
        currentFilters={currentFilters}
      />
    )
  }

  const RenderPreview = ({ item }: RenderPreviewProps<GenericSearchResult>) => {
    // mog('RenderPreview', { item })
    if (item) {
      const con = contents[item.id]
      const content = con ? con.content : defaultContent.content
      const node = getNode(item.id)
      const icon = node?.icon ?? fileList2Line
      const edNode = { ...node, title: node.path, id: node.nodeid }
      mog('RenderPreview', { item, content, node })
      return (
        <SplitSearchPreviewWrapper id={`splitSearchPreview_for_${item.id}`}>
          <Title>
            {node.path}
            <Icon icon={icon} />
          </Title>
          <Metadata fadeOnHover={false} node={edNode} />
          <EditorPreviewRenderer content={content} editorId={`SearchPreview_editor_${item.id}`} />
          <Backlinks nodeid={node.nodeid} />
          <TagsRelated nodeid={node.nodeid} />
        </SplitSearchPreviewWrapper>
      )
    } else
      return (
        <SplitSearchPreviewWrapper>
          <Title></Title>
          <EditorPreviewRenderer content={defaultContent.content} editorId={`SearchPreview_editor_EMPTY`} />
        </SplitSearchPreviewWrapper>
      )
  }

  return (
    <SearchContainer>
      <MainHeader>
        <Title>Search</Title>
      </MainHeader>
      <SearchView
        id="searchStandard"
        key="searchStandard"
        initialItems={initialResults}
        getItemKey={(i) => i.id}
        onSelect={onSelect}
        onEscapeExit={onEscapeExit}
        onSearch={onSearch}
        filterResults={filterResults}
        RenderFilters={RenderFilters}
        RenderItem={RenderItem}
        RenderPreview={RenderPreview}
      />
    </SearchContainer>
  )
}

export default Search
