import useLoad from '../../hooks/useLoad'
import { useNodes } from '../../hooks/useNodes'
import deleteBin6Line from '@iconify-icons/ri/delete-bin-6-line'
import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import React, { useEffect } from 'react'
import { useUpdater } from '../../hooks/useUpdater'
import { generateSnippetId } from '../../data/Defaults/idPrefixes'
import Editor from '../../editor/Editor'
import { useSnippetStore } from '../../store/useSnippetStore'
import IconButton from '../../style/Buttons'
import { Wrapper } from '../../style/Layouts'
import {
  CreateSnippet,
  SnippetCommand,
  SnippetCommandPrefix,
  SnippetHeader,
  SSnippet,
  SSnippets,
  StyledSnippetPreview
} from '../../style/Snippets'
import { Title } from '../../style/Typography'
import genereateName from 'project-name-generator'
import { NavigationType, ROUTE_PATHS, useRouting } from '../routes/urls'
import { useSnippets } from '../../hooks/useSnippets'
import { GenericSearchResult, useSearchStore } from '../../store/useSearchStore'
import { mog } from '../../utils/lib/helper'
import SearchView, { RenderItemProps, RenderPreviewProps } from '../../components/mex/Search/SearchView'
import {
  Result,
  ResultDesc,
  ResultHeader,
  ResultMain,
  ResultRow,
  ResultTitle,
  SearchContainer,
  SearchPreviewWrapper,
  SplitSearchPreviewWrapper
} from '../../style/Search'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import Backlinks from '../../components/mex/Backlinks'
import TagsRelated from '../../components/mex/Tags/TagsRelated'
import { defaultContent } from '../../data/Defaults/baseData'
import fileList2Line from '@iconify-icons/ri/file-list-2-line'
import { convertContentToRawText } from '../../utils/search/localSearch'
import { View } from '../../components/mex/Search/ViewSelector'

export type SnippetsProps = {
  title?: string
}

const Snippets = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const { addSnippet, deleteSnippet, getSnippetContent, getSnippet } = useSnippets()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { updater } = useUpdater()
  const searchIndex = useSearchStore((store) => store.searchIndex)
  const { getNode } = useNodes()
  const { goTo } = useRouting()
  const initialSnippets: GenericSearchResult[] = snippets.map((snippet) => ({
    id: snippet.id,
    title: snippet.title,
    text: convertContentToRawText(snippet.content)
  }))

  const onSearch = (newSearchTerm: string) => {
    const res = searchIndex('snippet', newSearchTerm)
    mog('search', { res })
    if (newSearchTerm === '' && res.length === 0) {
      return initialSnippets
    }
    return res
  }

  const onCreateNew = () => {
    // Create a better way.
    const snippetId = generateSnippetId()
    addSnippet({
      id: snippetId,
      title: genereateName().dashed,
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)
    updater()

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId)
  }

  const onOpenSnippet = (id: string) => {
    loadSnippet(id)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, id)
  }

  const onDeleteSnippet = (id: string) => {
    deleteSnippet(id)
  }

  // console.log({ result })
  const onSelect = (item: GenericSearchResult) => {
    const snippetid = item.id
    onOpenSnippet(snippetid)
  }

  const onEscapeExit = () => {
    // const nodeid = nodeUID ?? lastOpened[0] ?? baseNodeId
    // loadNode(nodeid)
    goTo(ROUTE_PATHS.snippets, NavigationType.push)
  }

  // Forwarding ref to focus on the selected result
  const BaseItem = (
    { item, splitOptions, ...props }: RenderItemProps<GenericSearchResult>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const snip = getSnippet(item.id)
    if (!item || !snip) {
      return <Result {...props} ref={ref}></Result>
    }
    const icon = quillPenLine
    const id = `${item.id}_ResultFor_SearchSnippet`

    if (props.view === View.Card) {
      return (
        <Result {...props} key={id} ref={ref}>
          <SnippetHeader>
            <SnippetCommand onClick={() => onOpenSnippet(snip.id)}>
              <SnippetCommandPrefix>/snip.</SnippetCommandPrefix>
              {snip.title}
            </SnippetCommand>

            <IconButton size={20} icon={deleteBin6Line} title="delete" onClick={() => onDeleteSnippet(snip.id)} />
          </SnippetHeader>
          <SearchPreviewWrapper active={item.matchField?.includes('text')}>
            <EditorPreviewRenderer content={snip.content} editorId={`editor_${item.id}`} />
          </SearchPreviewWrapper>
        </Result>
      )
    } else if (props.view === View.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
            <Icon icon={icon} />
            <ResultMain>
              <ResultTitle>{snip.title}</ResultTitle>
              <ResultDesc>{convertContentToRawText(snip.content, ' ')}</ResultDesc>
            </ResultMain>
          </ResultRow>
        </Result>
      )
    }
  }
  const RenderItem = React.forwardRef(BaseItem)

  const RenderPreview = ({ item }: RenderPreviewProps<GenericSearchResult>) => {
    // mog('RenderPreview', { item })
    const snip = getSnippet(item.id)
    const icon = quillPenLine
    if (item) {
      // const edNode = { ...node, title: node.path, id: node.nodeid }
      return (
        <SplitSearchPreviewWrapper id={`splitSearchPreview_for_${item.id}`}>
          <Title>
            {snip.title}
            <Icon icon={icon} />
          </Title>
          <EditorPreviewRenderer content={snip.content} editorId={`SearchPreview_editor_${item.id}`} />
        </SplitSearchPreviewWrapper>
      )
    } else
      return (
        <SplitSearchPreviewWrapper>
          <Title></Title>
        </SplitSearchPreviewWrapper>
      )
  }

  return (
    <SearchContainer>
      <Title>Snippets</Title>
      <SearchView
        id="searchStandard"
        key="searchStandard"
        initialItems={initialSnippets}
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

export default Snippets
/*
const Snippets: React.FC<SnippetsProps> = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const { addSnippet, deleteSnippet } = useSnippets()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const searchIndex = useSearchStore((store) => store.searchIndex)

  const { goTo } = useRouting()
  const { updater } = useUpdater()

  useEffect(() => {
    const res = searchIndex('snippet', 'ligma')
    mog('SnippetSearch', { res })
  }, [snippets])


  return (
    <Wrapper>
      <Title>Snippets</Title>
      <SSnippets>
        <CreateSnippet onClick={onCreateNew}>
          <Icon icon={quillPenLine} height={100} />
          <p>Create New Snippet</p>
        </CreateSnippet>
        {snippets.map((s) => (
          <SSnippet key={`SnippetPreview_${s.id}`}>

            <StyledSnippetPreview
              onClick={() => {
                onOpenSnippet(s.id)
              }}
            >
              <Editor readOnly content={s.content} editorId={`Editor_Embed_${s.id}`} />
            </StyledSnippetPreview>
          </SSnippet>
        ))}
      </SSnippets>
    </Wrapper>
  )
}

export default Snippets */
