import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SnippetSaverButton } from '../../editor/Components/Saver'
import Editor from '../../editor/Editor'
import { EditorWrapper, InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../../style/Editor'
import { Input } from '../../style/Form'
import { useSnippetStore } from '../../store/useSnippetStore'
import { useUpdater } from '../../hooks/useUpdater'
import IconButton from '../../style/Buttons'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../views/routes/urls'
import tinykeys from 'tinykeys'
import { useSnippetBuffer } from '../../hooks/useEditorBuffer'
import { selectEditor, usePlateEditorRef } from '@udecode/plate'

type Inputs = {
  title: string
}

const SnippetEditor = () => {
  const snippet = useSnippetStore((store) => store.editor.snippet)
  const { goTo } = useRouting()

  const {
    register,
    getValues,
    formState: { errors }
  } = useForm<Inputs>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  const { updater } = useUpdater()
  const { addOrUpdateValBuffer, saveAndClearBuffer } = useSnippetBuffer()

  useEffect(() => {
    if (snippet) {
      setContent(snippet.content)
    } else {
      returnToSnippets()
    }
  }, [snippet])

  const getSnippetTitle = () => getValues().title

  const onChangeSave = (val: any[]) => {
    // mog('onChangeSave', { val })
    if (val) {
      addOrUpdateValBuffer(snippet.id, val)
    }
  }

  const { params } = useRouting()
  const snippetid = snippet?.id ?? params.snippetid
  const editorRef = usePlateEditorRef()

  const onFocusClick = () => {
    if (editorRef) {
      selectEditor(editorRef, { focus: true })
    }
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

  const returnToSnippets = () => {
    saveAndClearBuffer()
    updater()
    goTo(ROUTE_PATHS.snippets, NavigationType.push)
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
            [[ <Input autoFocus defaultValue={snippet && snippet.title} {...register('title')} /> ]]
          </NoteTitle>

          <InfoTools>
            <SnippetSaverButton getSnippetTitle={getSnippetTitle} title="Save Snippet" />
          </InfoTools>
        </NodeInfo>

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
      </StyledEditor>
    </>
  )
}

export default SnippetEditor
