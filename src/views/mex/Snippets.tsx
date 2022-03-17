import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import genereateName from 'project-name-generator'
import React from 'react'
import SearchView, { RenderItemProps, RenderPreviewProps } from '../../components/mex/Search/SearchView'
import { View } from '../../components/mex/Search/ViewSelector'
import { generateSnippetId } from '../../data/Defaults/idPrefixes'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import { useNodes } from '../../hooks/useNodes'
import { useSnippets } from '../../hooks/useSnippets'
import { useUpdater } from '../../hooks/useUpdater'
import { useSnippetStore } from '../../store/useSnippetStore'
import IconButton, { Button } from '../../style/Buttons'
import { MainHeader } from '../../style/Layouts'
import {
  Result,
  ResultDesc,
  ResultMain,
  ResultRow,
  ResultTitle,
  SearchContainer,
  SearchPreviewWrapper,
  SplitSearchPreviewWrapper
} from '../../style/Search'
import { CreateSnippet, SnippetCommand, SnippetCommandPrefix, SnippetHeader } from '../../style/Snippets'
import { Title } from '../../style/Typography'
import { mog } from '../../utils/lib/helper'
import { convertContentToRawText } from '../../utils/search/localSearch'
import { NavigationType, ROUTE_PATHS, useRouting } from '../routes/urls'

import { useSearch } from '../../hooks/useSearch'
import { GenericSearchResult } from '../../types/search'

export type SnippetsProps = {
  title?: string
}

const Snippets = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const { addSnippet, deleteSnippet, getSnippetContent, getSnippet } = useSnippets()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { updater } = useUpdater()
  const { queryIndex } = useSearch()
  const { getNode } = useNodes()
  const { goTo } = useRouting()
  const initialSnippets: GenericSearchResult[] = snippets.map((snippet) => ({
    id: snippet.id,
    title: snippet.title,
    text: convertContentToRawText(snippet.content)
  }))

  const onSearch = async (newSearchTerm: string) => {
    const res = await queryIndex('snippet', newSearchTerm)
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
      icon: 'ri:quill-pen-line',
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
    if (!item) {
      return null
    }
    const snip = getSnippet(item.id)
    if (!snip) {
      return null
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

    return null
  }
  const RenderItem = React.forwardRef(BaseItem)

  const RenderStartCard = () => {
    // mog('RenderPreview', { item })
    return (
      <CreateSnippet onClick={onCreateNew}>
        <Icon icon={quillPenLine} height={100} />
        <p>Create New Snippet</p>
      </CreateSnippet>
    )
  }

  const RenderPreview = ({ item }: RenderPreviewProps<GenericSearchResult>) => {
    // mog('RenderPreview', { item })
    if (item) {
      const snip = getSnippet(item.id)
      const icon = quillPenLine
      // const edNode = { ...node, title: node.path, id: node.nodeid }
      return (
        <SplitSearchPreviewWrapper id={`splitSnippetSearchPreview_for_${item.id}`}>
          <Title>
            {snip.title}
            <Icon icon={icon} />
          </Title>
          <EditorPreviewRenderer content={snip.content} editorId={`SnippetSearchPreview_editor_${item.id}`} />
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
      <MainHeader>
        <Title>Snippets</Title>
        <Button primary large onClick={onCreateNew}>
          <Icon icon={quillPenLine} height={24} />
          Create New Snippet
        </Button>
      </MainHeader>
      <SearchView
        id="searchSnippet"
        key="searchSnippet"
        initialItems={initialSnippets}
        getItemKey={(i) => i.id}
        onSelect={onSelect}
        onEscapeExit={onEscapeExit}
        onSearch={onSearch}
        RenderItem={RenderItem}
        RenderPreview={RenderPreview}
        RenderStartCard={RenderStartCard}
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
