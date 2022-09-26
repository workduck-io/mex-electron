import { useNamespaces } from '@hooks/useNamespaces'
import { useSaveData } from '@hooks/useSaveData'
import { useSnippets } from '@hooks/useSnippets'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import shareLine from '@iconify/icons-ri/share-line'
import { Icon } from '@iconify/react'
import { useSnippetStore } from '@store/useSnippetStore'
import { mog } from '@utils/lib/helper'
import { convertContentToRawText } from '@utils/search/parseData'
import { IconButton, Infobox } from '@workduck-io/mex-components'
import React, { useMemo } from 'react'
import { defaultContent } from '../../../data/Defaults/baseData'
import { SearchHelp } from '../../../data/Defaults/helpText'
import { useBlockHighlightStore } from '../../../editor/Actions/useFocusBlock'
import EditorPreviewRenderer from '../../../editor/EditorPreviewRenderer'
import { useFilters } from '../../../hooks/useFilters'
import useLoad from '../../../hooks/useLoad'
import { useNodes } from '../../../hooks/useNodes'
import { useSearch } from '../../../hooks/useSearch'
import { useTags } from '../../../hooks/useTags'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useEditorStore } from '../../../store/useEditorStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { MainHeader } from '../../../style/Layouts'
import {
  ItemTag,
  Result,
  ResultCardFooter,
  ResultDesc,
  ResultHeader,
  ResultMain,
  ResultMetaData,
  ResultPreviewMetaData,
  ResultRow,
  ResultTitle,
  SearchContainer,
  SearchPreviewWrapper,
  SplitSearchPreviewWrapper
} from '../../../style/Search'
import { Title, TitleText } from '../../../style/Typography'
import { GenericSearchResult, idxKey } from '../../../types/search'
import { NodeType } from '../../../types/Types'
import { SplitType } from '../../../ui/layout/splitView'
import { getInitialNode } from '../../../utils/helpers'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import Backlinks from '../Backlinks'
import Metadata from '../Metadata/Metadata'
import NamespaceTag from '../NamespaceTag'
import TagsRelated, { TagsRelatedTiny } from '../Tags/TagsRelated'
import SearchFilters from './SearchFilters'
import SearchView, { RenderFilterProps, RenderItemProps, RenderPreviewProps } from './SearchView'
import { View } from './ViewSelector'

const Search = () => {
  const { loadNode } = useLoad()
  const contents = useContentStore((store) => store.contents)
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const ilinks = useDataStore((store) => store.ilinks)
  const initialResults = ilinks
    .map(
      (link): GenericSearchResult => ({
        id: link.nodeid,
        title: link.path,
        index: 'node'
      })
    )
    .slice(0, 12)
  const snippets = useSnippetStore((store) => store.snippets)
  const { initialSnippets }: { initialSnippets: GenericSearchResult[] } = useMemo(
    () => ({
      initialSnippets: snippets
        .map((snippet) => ({
          id: snippet.id,
          title: snippet.title,
          index: snippet.template ? ('template' as const) : ('snippet' as const),
          text: convertContentToRawText(snippet.content)
        }))
        .slice(0, 12)
    }),
    [snippets]
  )
  const { getNode, getNodeType } = useNodes()
  const { saveData } = useSaveData()
  const { goTo } = useRouting()
  const { deleteSnippet, getSnippet } = useSnippets()
  const { getNamespace } = useNamespaces()
  const {
    applyCurrentFilters,
    addCurrentFilter,
    setFilters,
    generateNodeSearchFilters,
    removeCurrentFilter,
    filters,
    currentFilters,
    changeCurrentFilter,
    resetCurrentFilters,
    globalJoin,
    setGlobalJoin
  } = useFilters<GenericSearchResult>()

  const { queryIndexWithRanking } = useSearch()
  const { hasTags } = useTags()
  const clearHighlights = useBlockHighlightStore((store) => store.clearHighlightedBlockIds)
  // const setHighlights = useBlockHighlightStore((store) => store.setHighlightedBlockIds)

  const onSearch = async (newSearchTerm: string, idxKeys: idxKey[]) => {
    const res = await queryIndexWithRanking(idxKeys, newSearchTerm)
    const filRes =
      idxKeys.length === 1 && idxKeys.includes('node')
        ? res.filter((r) => {
            const nodeType = getNodeType(r.id)
            if (r.index === 'node') {
              return nodeType !== NodeType.MISSING && nodeType !== NodeType.ARCHIVED
            }
            return true
          })
        : res
    mog('search', { res, filRes, idxKeys })
    clearHighlights('preview')
    return filRes
  }

  const lastOpened = useRecentsStore((store) => store.lastOpened)
  const nodeUID = useEditorStore((store) => store.node.nodeid)
  const baseNodeId = useDataStore((store) => store.baseNodeId)
  const isHighlightBlock = (item: GenericSearchResult) => item.matchField?.includes('text')

  const onOpenItem = (item: GenericSearchResult) => {
    if (item.index === 'node') {
      loadNode(item.id, { highlightBlockId: isHighlightBlock(item) ? item.blockId : undefined })
      goTo(ROUTE_PATHS.node, NavigationType.push, item.id)
    } else if (item.index === 'snippet' || item.index === 'template') {
      loadSnippet(item.id)
      goTo(ROUTE_PATHS.snippet, NavigationType.push, item.id, { title: item.title })
    }
  }

  const onEscapeExit = () => {
    const nodeid = nodeUID ?? lastOpened[0] ?? baseNodeId
    loadNode(nodeid)
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  const onDoubleClick = (e: React.MouseEvent<HTMLElement>, item: GenericSearchResult) => {
    e.preventDefault()
    if (e.detail === 2) {
      onOpenItem(item)
    }
  }

  const onDeleteSnippet = async (id: string) => {
    try {
      await deleteSnippet(id)
      saveData()
    } catch (err) {
      mog('Unable to delete note')
    }
  }

  // Forwarding ref to focus on the selected result
  const BaseItem = (
    { item, splitOptions, ...props }: RenderItemProps<GenericSearchResult>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    if (!item) {
      return null
    }
    if (item.index === 'snippet' || item.index === 'template') {
      const snip = getSnippet(item.id)
      if (!snip) {
        return null
      }
      const icon = quillPenLine
      const id = `${item.id}_ResultFor_SearchSnippet_`

      // mog('search', {
      //   id,
      //   item
      // })

      if (props.view === View.Card) {
        return (
          <Result {...props} key={id} ref={ref}>
            <ResultHeader>
              <Icon icon={icon} />
              <ResultTitle onClick={() => onOpenItem(item)}>{snip.title}</ResultTitle>
              {snip.template && (
                <ItemTag large>
                  <Icon icon={magicLine} />
                  Template
                </ItemTag>
              )}
              <IconButton size={20} icon={deleteBin6Line} title="delete" onClick={() => onDeleteSnippet(snip.id)} />
            </ResultHeader>
            <SearchPreviewWrapper onClick={() => onOpenItem(item)} active={item.matchField?.includes('text')}>
              <EditorPreviewRenderer content={snip.content} editorId={`editor_${item.id}`} />
            </SearchPreviewWrapper>
          </Result>
        )
      } else if (props.view === View.List) {
        return (
          <Result {...props} key={id} ref={ref}>
            <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
              <Icon icon={icon} />
              <ResultMain onClick={() => onOpenItem(item)}>
                <ResultTitle>{snip.title}</ResultTitle>
                <ResultDesc>{convertContentToRawText(snip.content, ' ')}</ResultDesc>
              </ResultMain>
              {snip.template && (
                <ItemTag>
                  <Icon icon={magicLine} />
                  Template
                </ItemTag>
              )}
              <IconButton size={20} icon={deleteBin6Line} title="delete" onClick={() => onDeleteSnippet(snip.id)} />
            </ResultRow>
          </Result>
        )
      }
    }
    const node = getNode(item.id, true)
    if (!item || !node) {
      return <Result {...props} ref={ref}></Result>
    }
    const nodeType = getNodeType(node.nodeid)
    const con = contents[item.id]
    const content = con ? con.content : defaultContent.content
    const icon = node?.icon ?? (nodeType === NodeType.SHARED ? shareLine : fileList2Line)
    const edNode = node ? { ...node, title: node.path, id: node.nodeid } : getInitialNode()
    const isTagged = hasTags(edNode.nodeid)
    const id = `${item.id}_ResultFor_Search`
    const namespace = getNamespace(node.namespace)
    // mog('Baseitem', { item, node, icon, nodeType })
    if (props.view === View.Card) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultHeader active={item.matchField?.includes('title')}>
            <Icon icon={icon} />
            <ResultTitle>{node.path}</ResultTitle>
            {namespace && <NamespaceTag namespace={namespace} />}
          </ResultHeader>
          <SearchPreviewWrapper active={item.matchField?.includes('text')}>
            <EditorPreviewRenderer content={content} editorId={`editor_${item.id}`} />
          </SearchPreviewWrapper>
          {isTagged && (
            <ResultCardFooter>
              <TagsRelatedTiny nodeid={edNode.nodeid} />
            </ResultCardFooter>
          )}
        </Result>
      )
    } else if (props.view === View.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
            <Icon icon={icon} />
            <ResultMain>
              <ResultTitle>
                {node.path}
                {namespace && <NamespaceTag namespace={namespace} />}
              </ResultTitle>
              <ResultDesc>{item.text ?? convertContentToRawText(content, ' ')}</ResultDesc>
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
    // mog('filtered', { filtered, nFilters, currentFilters, results })
    return filtered
  }

  const RenderFilters = (props: RenderFilterProps<GenericSearchResult>) => {
    return (
      <SearchFilters
        {...props}
        addCurrentFilter={addCurrentFilter}
        removeCurrentFilter={removeCurrentFilter}
        resetCurrentFilters={resetCurrentFilters}
        changeCurrentFilter={changeCurrentFilter}
        filters={filters}
        currentFilters={currentFilters}
        globalJoin={globalJoin}
        setGlobalJoin={setGlobalJoin}
      />
    )
  }

  const RenderPreview = ({ item }: RenderPreviewProps<GenericSearchResult>) => {
    // mog('RenderPreview', { item })
    if (!item)
      return (
        <SplitSearchPreviewWrapper>
          <Title></Title>
          <EditorPreviewRenderer content={defaultContent.content} editorId={`SearchPreview_editor_EMPTY`} />
        </SplitSearchPreviewWrapper>
      )
    if (item.index === 'snippet' || item.index === 'template') {
      const icon = quillPenLine
      const snip = getSnippet(item.id)
      // const edNode = { ...node, title: node.path, id: node.nodeid }
      if (snip)
        return (
          <SplitSearchPreviewWrapper id={`splitSnippetSearchPreview_for_${item.id}`}>
            <Title onMouseUp={(e) => onDoubleClick(e, item)}>
              <span className="title">{snip.title}</span>
              {snip.template && (
                <ItemTag large>
                  <Icon icon={magicLine} />
                  Template
                </ItemTag>
              )}
              <Icon icon={icon} />
            </Title>
            <EditorPreviewRenderer
              onDoubleClick={(e) => onDoubleClick(e, item)}
              content={snip.content}
              editorId={`SnippetSearchPreview_editor_${item.id}`}
            />
          </SplitSearchPreviewWrapper>
        )
    }
    if (item.index === 'node' || item.index === 'shared') {
      const con = contents[item.id]
      const content = con ? con.content : defaultContent.content
      const node = getNode(item.id, true)
      const nodeType = getNodeType(node?.nodeid)
      const icon = node?.icon ?? (nodeType === NodeType.SHARED ? shareLine : fileList2Line)
      const namespace = getNamespace(node?.namespace)
      const edNode = { ...node, title: node?.path, id: node?.nodeid }
      // mog('RenderPreview', { item, content, node })
      return (
        <SplitSearchPreviewWrapper id={`splitSearchPreview_for_${item.id}`}>
          <Title onMouseUp={(e) => onDoubleClick(e, item)}>
            <Icon icon={icon} />
            <TitleText>
              {edNode?.title}
              {namespace && <NamespaceTag namespace={namespace} />}
            </TitleText>
            <ResultPreviewMetaData>
              <Metadata fadeOnHover={false} node={edNode} />
            </ResultPreviewMetaData>
          </Title>
          <EditorPreviewRenderer
            content={content}
            blockId={isHighlightBlock(item) ? item.blockId : undefined}
            onDoubleClick={(e) => onDoubleClick(e, item)}
            editorId={`SearchPreview_editor_${item.id}`}
          />
          <Backlinks nodeid={edNode?.id} />
          <TagsRelated nodeid={edNode?.id} />
        </SplitSearchPreviewWrapper>
      )
    }
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
        <Infobox text={SearchHelp} />
      </MainHeader>
      <SearchView
        id="searchStandard"
        key="searchStandard"
        initialItems={{ all: initialResults, notes: initialResults, snippets: initialSnippets }}
        indexes={{
          indexes: {
            all: ['node', 'shared', 'snippet', 'template'],
            notes: ['node', 'shared'],
            snippets: ['snippet', 'template']
          },
          default: 'all'
        }}
        getItemKey={(i) => i.id}
        onSelect={onOpenItem}
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
