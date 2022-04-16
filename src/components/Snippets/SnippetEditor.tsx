import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import { mog } from '../../utils/lib/helper'
import { debounce } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { SnippetSaverButton } from '../../editor/Components/Saver'
import Editor from '../../editor/Editor'
import { EditorWrapper, InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../../style/Editor'
import { Input } from '../../style/Form'
import { Snippet, useSnippetStore } from '../../store/useSnippetStore'
import { useUpdater } from '../../hooks/useUpdater'
import IconButton from '../../style/Buttons'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../views/routes/urls'
import tinykeys from 'tinykeys'
import { useSnippetBuffer, useSnippetBufferStore } from '../../hooks/useEditorBuffer'
import { getPlateEditorRef, selectEditor, usePlateEditorRef, usePlateEditorState } from '@udecode/plate'
import { useTransform } from '../../editor/Components/BalloonToolbar/components/useTransform'
import { IS_DEV } from '../../data/Defaults/dev_'
import { SnippetCopierButton } from './SnippetContentCopier'
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import Infobox from '../../ui/components/Help/Infobox'
import { Icon } from '@iconify/react'
import magicLine from '@iconify/icons-ri/magic-line'
import { TemplateToggle } from '../../style/Snippets'
import ItemTag from '../../ui/components/ItemTag/ItemTag'
import { DRAFT_NODE } from '../../data/Defaults/idPrefixes'
import { InputFormError } from '../mex/Forms/Input'
import toast from 'react-hot-toast'
import { getSlug } from '../../utils/lib/strings'

type Inputs = {
  title: string
}

const SnippetEditor = () => {
  const snippet = useSnippetStore((store) => store.editor.snippet)
  const { goTo } = useRouting()

  const { control, handleSubmit } = useForm<Inputs>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)
  // const [value, setValue] = useState('')

  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { updater } = useUpdater()
  const { addOrUpdateValBuffer, saveAndClearBuffer, getBufferVal } = useSnippetBuffer()
  const addTitle = useSnippetBufferStore((store) => store.addTitle)
  const buffer = useSnippetBufferStore((store) => store.buffer)
  const addAll = useSnippetBufferStore((store) => store.addAll)
  const toggleIsTemplate = useSnippetBufferStore((store) => store.toggleIsTemplate)

  useEffect(() => {
    if (snippet) {
      mog('Snippy', { snippet })
      addAll(snippet.id, snippet.content, snippet.title)
      setContent(snippet.content)
    } else {
      returnToSnippets()
    }
  }, [snippet])

  const getSnippetExtras = () => {
    const val = getBufferVal(snippet?.id)
    return { title: val?.title || snippet?.title || '', isTemplate: val?.isTemplate || snippet?.isTemplate || false }
  }

  const isSnippetTemplate = useMemo(() => {
    const val = getBufferVal(snippet?.id)
    console.log('Getting whether snippet is a template or not', { val, snippet })
    if (val && val.isTemplate !== undefined) {
      return val.isTemplate
    }
    return snippet?.isTemplate || false
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
    if (val && val.isTemplate !== undefined) {
      toggleIsTemplate(snippet.id, !val.isTemplate)
    } else toggleIsTemplate(snippet.id, !snippet.isTemplate)
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

  const defaultValue = snippet && snippet.title !== DRAFT_NODE ? snippet.title : ''

  const onDelay = debounce((value) => onChangeTitle(value), 250)

  const onChange = (e) => {
    const value = e.target.value
    onDelay(value)
  }

  return (
    <>
      <StyledEditor className="snippets_editor">
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
              [[ <Input autoFocus placeholder={DRAFT_NODE} defaultValue={defaultValue} onChange={onChange} /> ]]
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
    </>
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
        // if (!snippet.isTemplate) return
        // const edState = editorRef.current.getEditorState()
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
