import fileList2Line from '@iconify-icons/ri/file-list-2-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { defaultContent } from '../../../data/Defaults/baseData'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import { useLinks } from '../../../hooks/useLinks'
import useLoad from '../../../hooks/useLoad'
import { useNodes } from '../../../hooks/useNodes'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { GenericSearchResult, useSearchStore } from '../../../store/useSearchStore'
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
import { mog } from '../../../utils/lib/helper'
import { convertContentToRawText } from '../../../utils/search/localSearch'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import Backlinks from '../Backlinks'
import Metadata from '../Metadata/Metadata'
import DataInfoBar from '../Sidebar/DataInfoBar'
import TagsRelated from '../Tags/TagsRelated'
import SearchView, { RenderItemProps, RenderPreviewProps } from './SearchView'
import { View } from './ViewSelector'

const Search = () => {
  const { loadNode } = useLoad()
  const searchIndex = useSearchStore((store) => store.searchIndex)
  const contents = useContentStore((store) => store.contents)
  const { getNode } = useNodes()
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
  const BaseItem = (
    { item, splitOptions, ...props }: RenderItemProps<GenericSearchResult>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const con = contents[item.id]
    const node = getNode(item.id)
    const content = con ? con.content : defaultContent.content
    const icon = node.icon ?? fileList2Line
    const edNode = { ...node, title: node.path, id: node.nodeid }
    if (props.view === View.Card) {
      return (
        <Result {...props} ref={ref}>
          <ResultHeader active={item.matchField.includes('title')}>
            <ResultTitle>{node.path}</ResultTitle>
          </ResultHeader>
          <SearchPreviewWrapper active={item.matchField.includes('text')}>
            <EditorPreviewRenderer content={content} editorId={`editor_${item.id}`} />
          </SearchPreviewWrapper>
        </Result>
      )
    } else if (props.view === View.List) {
      return (
        <Result {...props} ref={ref}>
          <ResultRow active={item.matchField.includes('title')} selected={props.selected}>
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

  const RenderPreview = ({ item }: RenderPreviewProps<GenericSearchResult>) => {
    console.log('RenderPreview', { item })
    if (item) {
      const con = contents[item.id]
      const content = con ? con.content : defaultContent.content
      const node = getNode(item.id)
      const icon = node.icon ?? fileList2Line
      const edNode = { ...node, title: node.path, id: node.nodeid }
      return (
        <SplitSearchPreviewWrapper>
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
    } else return null
  }

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
        RenderPreview={RenderPreview}
      />
    </SearchContainer>
  )
}

export default Search
