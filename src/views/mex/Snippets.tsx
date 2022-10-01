import React, { useEffect, useMemo } from 'react'

import { useApi } from '@apis/useSaveApi'
import deleteBin6Line from '@iconify/icons-ri/delete-bin-6-line'
import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { mog } from '@utils/lib/mog'
import { nanoid } from 'nanoid'
import generateName from 'project-name-generator'

import { Button, IconButton, Infobox } from '@workduck-io/mex-components'
import { runBatch } from '@workduck-io/mex-utils'

import SearchView, { RenderItemProps, RenderPreviewProps } from '../../components/mex/Search/SearchView'
import { View } from '../../components/mex/Search/ViewSelector'
import { IS_DEV } from '../../data/Defaults/dev_'
import { SnippetHelp } from '../../data/Defaults/helpText'
import { DRAFT_NODE, generateSnippetId } from '../../data/Defaults/idPrefixes'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import { useSaveData } from '../../hooks/useSaveData'
import { useSearch } from '../../hooks/useSearch'
import { useSnippets } from '../../hooks/useSnippets'
import { useUpdater } from '../../hooks/useUpdater'
import { Snippet, useSnippetStore } from '../../store/useSnippetStore'
import { MainHeader } from '../../style/Layouts'
import {
  Result,
  ResultDesc,
  ResultHeader,
  ResultMain,
  ResultRow,
  ResultTitle,
  SearchPreviewWrapper,
  ItemTag,
  SplitSearchPreviewWrapper
} from '../../style/Search'
import { SnippetsSearchContainer } from '../../style/Snippets'
import { Title } from '../../style/Typography'
import { GenericSearchResult } from '../../types/search'
// import { mog } from '@utils/lib/mog'
import { convertContentToRawText } from '../../utils/search/parseData'
import { NavigationType, ROUTE_PATHS, useRouting } from '../routes/urls'

export type SnippetsProps = {
  title?: string
}

const Snippets = () => {
  const snippets = useSnippetStore((store) => store.snippets)
  const { addSnippet, deleteSnippet, getSnippet, getSnippets, updateSnippet } = useSnippets()
  const api = useApi()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { updater } = useUpdater()
  const { queryIndex } = useSearch()
  const { goTo } = useRouting()
  const { saveData } = useSaveData()
  const { initialSnippets }: { initialSnippets: GenericSearchResult[] } = useMemo(
    () => ({
      initialSnippets: snippets.map((snippet) => ({
        id: snippet.id,
        title: snippet.title,
        text: convertContentToRawText(snippet.content)
      }))
    }),
    [snippets]
  )

  const randId = useMemo(() => nanoid(), [initialSnippets])

  const onSearch = async (newSearchTerm: string): Promise<GenericSearchResult[]> => {
    const res = await queryIndex(['template', 'snippet'], newSearchTerm)

    if (newSearchTerm === '' && res.length === 0) {
      return initialSnippets
    }
    return res
  }

  const onCreateNew = (generateTitle = false) => {
    // Create a better way.
    const snippetId = generateSnippetId()
    const snippetName = generateTitle ? generateName().dashed : DRAFT_NODE

    addSnippet({
      id: snippetId,
      title: snippetName,
      icon: 'ri:quill-pen-line',
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)
    updater()

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }

  // * Delete this create special snippet
  const onCreateSpecialSnippet = (generateTitle = false) => {
    const snippetId = generateSnippetId()
    const snippetName = generateTitle ? generateName().dashed : DRAFT_NODE

    addSnippet({
      id: snippetId,
      title: snippetName,
      template: true,
      icon: 'ri:quill-pen-line',
      content: [{ children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]
    })

    loadSnippet(snippetId)
    updater()

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }

  const onOpenSnippet = (id: string) => {
    loadSnippet(id)
  }

  const onDoubleClick = (e: React.MouseEvent<HTMLElement>, id: string, title: string) => {
    e.preventDefault()
    if (e.detail === 2) {
      onOpenSnippet(id)
      goTo(ROUTE_PATHS.snippet, NavigationType.push, id, { title })
    }
  }
  const onDeleteSnippet = (id: string) => {
    deleteSnippet(id)
    saveData()
    goTo(ROUTE_PATHS.snippets, NavigationType.replace)
  }

  // console.log({ result })
  const onSelect = (item: GenericSearchResult, e?: React.MouseEvent) => {
    if (e) {
      return
    }
    const snippetId = item.id
    const snippetName = item.title
    onOpenSnippet(snippetId)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
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
    const id = `${item.id}_ResultFor_SearchSnippet_${randId}`

    if (props.view === View.Card) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultHeader>
            <Icon icon={icon} />
            <ResultTitle onClick={() => onSelect({ id: snip.id, title: snip.title })}>{snip.title}</ResultTitle>
            {snip.template && (
              <ItemTag large>
                <Icon icon={magicLine} />
                Template
              </ItemTag>
            )}
            <IconButton size={20} icon={deleteBin6Line} title="delete" onClick={() => onDeleteSnippet(snip.id)} />
          </ResultHeader>
          <SearchPreviewWrapper
            onClick={() => onSelect({ id: snip.id, title: snip.title })}
            active={item.matchField?.includes('text')}
          >
            <EditorPreviewRenderer content={snip.content} editorId={`editor_${item.id}`} />
          </SearchPreviewWrapper>
        </Result>
      )
    } else if (props.view === View.List) {
      return (
        <Result {...props} key={id} ref={ref}>
          <ResultRow active={item.matchField?.includes('title')} selected={props.selected}>
            <Icon icon={icon} />
            <ResultMain onClick={() => onSelect({ id: snip.id, title: snip.title })}>
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

    return null
  }
  const RenderItem = React.forwardRef(BaseItem)

  // const RenderStartCard = () => {
  //   // mog('RenderPreview', { item })
  //   return (
  //     <CreateSnippet onClick={onCreateNew}>
  //       <Icon icon={quillPenLine} height={100} />
  //       <p>Create New Snippet</p>
  //     </CreateSnippet>
  //   )
  // }

  const RenderPreview = ({ item }: RenderPreviewProps<GenericSearchResult>) => {
    // mog('RenderPreview', { item })
    if (item) {
      const icon = quillPenLine
      const snip = getSnippet(item.id)
      // const edNode = { ...node, title: node.path, id: node.nodeid }
      if (snip)
        return (
          <SplitSearchPreviewWrapper id={`splitSnippetSearchPreview_for_${item.id}_${randId}`}>
            <Title onMouseUp={(e) => onDoubleClick(e, item.id, item.title)}>
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
              onDoubleClick={(e) => onDoubleClick(e, item.id, item.title)}
              content={snip.content}
              editorId={`${item.id}_Snippet_Preview_Editor`}
            />
          </SplitSearchPreviewWrapper>
        )
    }
    return null
  }

  useEffect(() => {
    const snippets = getSnippets()
    const unfetchedSnippets = snippets.filter((snippet) => snippet.content.length === 0)

    const requests = unfetchedSnippets.map(
      async (item) =>
        await api.getSnippetById(item.id).then((response) => {
          updateSnippet(response as Snippet)
        })
    )

    runBatch(requests).catch((err) => {
      mog('Failed to fetch snippets', { err })
    })
  }, [])

  // mog('Snippets', { initialSnippets })
  return (
    <SnippetsSearchContainer>
      <MainHeader>
        <Title>Snippets</Title>
        <Button primary onClick={() => onCreateNew()}>
          <Icon icon={quillPenLine} height={24} />
          Create New Snippet
        </Button>
        {IS_DEV && (
          <Button primary onClick={() => onCreateSpecialSnippet()}>
            <Icon icon={magicLine} height={24} />
            Create New Template Snippet
          </Button>
        )}
        <Infobox text={SnippetHelp} />
      </MainHeader>
      <SearchView
        id={`searchSnippet_${randId}`}
        key={`searchSnippet_${randId}`}
        initialItems={initialSnippets}
        getItemKey={(i) => i.id}
        onSelect={onSelect}
        onDelete={(i) => onDeleteSnippet(i.id)}
        onEscapeExit={onEscapeExit}
        onSearch={onSearch}
        options={{ view: View.Card }}
        RenderItem={RenderItem}
        RenderPreview={RenderPreview}
      />
    </SnippetsSearchContainer>
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
