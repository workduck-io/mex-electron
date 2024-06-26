import React, { useEffect, useMemo, useState } from 'react'

import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import magicLine from '@iconify/icons-ri/magic-line'
import { SnippetProvider } from '@store/Context/context.snippet'
import useRouteStore, { BannerType } from '@store/useRouteStore'
import { selectEditor, usePlateEditorRef, usePlateEditorState } from '@udecode/plate'
import { mog } from '@utils/lib/mog'
import { debounce } from 'lodash'
import { useLocation } from 'react-router-dom'

import { IconButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { IS_DEV } from '../../data/Defaults/dev_'
import { DRAFT_NODE } from '../../data/Defaults/idPrefixes'
import { useTransform } from '../../editor/Components/BalloonToolbar/components/useTransform'
import { SnippetSaverButton } from '../../editor/Components/Saver'
import Editor from '../../editor/Editor'
import { useSnippetBuffer, useSnippetBufferStore } from '../../hooks/useEditorBuffer'
import { useUpdater } from '../../hooks/useUpdater'
import { Snippet, useSnippetStore } from '../../store/useSnippetStore'
import { EditorWrapper, InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../../style/Editor'
import { Input } from '../../style/Form'
import ItemTag from '../../ui/components/ItemTag/ItemTag'
import { getSlug } from '../../utils/lib/strings'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../views/routes/urls'
import { SnippetCopierButton } from './SnippetContentCopier'
import Banner from '@editor/Components/Banner'

const SnippetEditor = () => {
  const snippet = useSnippetStore((store) => store.editor.snippet)
  const { goTo } = useRouting()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)
  // const [value, setValue] = useState('')

  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const location = useLocation()
  const isBannerVisible = useRouteStore((s) => s.routes?.[location.pathname]?.banners?.includes(BannerType.editor))

  const { updater } = useUpdater()
  const { addOrUpdateValBuffer, saveAndClearBuffer, getBufferVal } = useSnippetBuffer()
  const addTitle = useSnippetBufferStore((store) => store.addTitle)
  const buffer = useSnippetBufferStore((store) => store.buffer)
  // const addAll = useSnippetBufferStore((store) => store.addAll)
  const toggleTemplate = useSnippetBufferStore((store) => store.toggleTemplate)

  useEffect(() => {
    if (snippet) {
      mog('Snippy', { snippet })
      // addAll(snippet.id, snippet.content, snippet.title)
      setContent(snippet.content)
    } else {
      // returnToSnippets()
    }
  }, [snippet])

  const getSnippetExtras = () => {
    const val = getBufferVal(snippet?.id)
    return { title: val?.title || snippet?.title || '', template: val?.template || snippet?.template || false }
  }

  const isSnippetTemplate = useMemo(() => {
    const val = getBufferVal(snippet?.id)
    console.log('Getting whether snippet is a template or not', { val, snippet })
    if (val && val.template !== undefined) {
      return val.template
    }
    return snippet?.template || false
  }, [snippet, buffer])

  const onChangeSave = (val: any[]) => {
    mog('onChangeSave', { val })
    if (val) {
      addOrUpdateValBuffer(snippet.id, val)
    }
  }

  const onChangeTitle = (title: string) => {
    const snippetTitle = title ? getSlug(title) : DRAFT_NODE
    addTitle(snippet.id, snippetTitle)
  }

  const { params } = useRouting()
  const snippetid = snippet?.id ?? params.snippetid
  const editorRef = usePlateEditorRef()

  const onFocusClick = () => {
    if (editorRef) {
      selectEditor(editorRef, { focus: true })
    }
  }

  const onToggleTemplate = () => {
    const val = getBufferVal(snippet.id)
    if (val && val.template !== undefined) {
      toggleTemplate(snippet.id, !val.template)
    } else toggleTemplate(snippet.id, !snippet.template)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        returnToSnippets()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const callbackAfterSave = () => {
    const { title } = getSnippetExtras()
    loadSnippet(snippet.id)
    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippet.id, { title })
    // const snippet = useSnippetStore.getState().sn
  }

  const returnToSnippets = () => {
    saveAndClearBuffer()
    updater()
    goTo(ROUTE_PATHS.snippets, NavigationType.push)
  }

  const defaultValue = useMemo(() => (snippet && snippet.title !== DRAFT_NODE ? snippet.title : ''), [snippet])

  const onDelay = debounce((value) => onChangeTitle(value), 250)

  const onChange = (e) => {
    const value = e.target.value
    onDelay(value)
  }

  const handleBannerButtonClick = () => {
    mog("handleBannerButtonClick");
  }

  return (
    <SnippetProvider>
      <StyledEditor className="snippets_editor">
        {isBannerVisible && (
          <Banner
            onClick={handleBannerButtonClick}
            title="Same Snippet is being accessed by multiple users. Data may get lost!"
          />
        )}
        <NodeInfo>
          <IconButton
            size={24}
            shortcut={`Esc`}
            icon={arrowLeftLine}
            onClick={returnToSnippets}
            title={'Return To Snippets'}
          />
          <NoteTitle>
            <>
              [[{' '}
              <Input
                id={snippet?.id ?? 'nullllll'}
                key={snippet?.id ?? 'nullllll'}
                placeholder={DRAFT_NODE}
                defaultValue={defaultValue}
                onChange={onChange}
              />{' '}
              ]]
            </>
          </NoteTitle>

          {snippet && (
            <InfoTools>
              {isSnippetTemplate && (
                <ItemTag tag={'Template'} icon={'ri-magic-line'} tooltip={'This snippet is a Template'} />
              )}
              <IconButton
                size={24}
                icon={magicLine}
                onClick={onToggleTemplate}
                highlight={isSnippetTemplate}
                title={isSnippetTemplate ? 'Convert to Snippet' : 'Convert to Template'}
              />
              <SnippetSaverButton
                getSnippetExtras={getSnippetExtras}
                callbackAfterSave={callbackAfterSave}
                title="Save Snippet"
              />
              {IS_DEV && <SnippetCopierButton />}
            </InfoTools>
          )}
        </NodeInfo>

        {snippet && (
          <EditorWrapper onClick={onFocusClick}>
            {
              <Editor
                autoFocus={false}
                options={{
                  exclude: { mentions: true }
                }}
                focusAtBeginning={false}
                onChange={onChangeSave}
                content={content}
                editorId={snippetid}
              />
            }
          </EditorWrapper>
        )}
      </StyledEditor>
      <CustomDevOnly editorId={snippetid} snippet={snippet} />
    </SnippetProvider>
  )
}

interface CustomDevOnlyProps {
  snippet: Snippet
  editorId: string
}

const CustomDevOnly = ({ snippet, editorId }: CustomDevOnlyProps) => {
  const { convertSelectionToQABlock } = useTransform()
  const editor = usePlateEditorState()!

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+Shift+,': (event) => {
        event.preventDefault()
        console.log('convertSelectionToQABlock', { editor })
        convertSelectionToQABlock(editor)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [snippet, editorId, editor])

  return <div id={`Speciale_${editorId}`} />
}

export default SnippetEditor
