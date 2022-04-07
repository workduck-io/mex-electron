import { RootElement } from '../SyncBlock'
import React, { useEffect, useRef, useState } from 'react'
import { InputBlock } from '../../../style/Form'
import { useDebouncedCallback } from 'use-debounce'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { mog } from '../../../utils/lib/helper'
import { useSearch } from '../../../hooks/useSearch'
import useLoad from '../../../hooks/useLoad'

import sw from 'stopword'
import useSuggestionStore from '../../../store/useSuggestions'
import { ReactEditor, useSelected } from 'slate-react'
import { Editor } from 'slate'
import { deleteFragment, insertNodes, selectEditor, setNodes, usePlateEditorRef } from '@udecode/plate'
import { KEYBOARD_KEYS } from '../../../components/spotlight/Home/components/List'
import { QuestionInput } from './styled'
import { useRouting } from '../../../views/routes/urls'
import { defaultContent } from '../../../data/Defaults/baseData'
import { getSlug } from '../../../utils/lib/strings'

interface QABlockProps {
  attributes: any
  element: any
}

const QABlock: React.FC<QABlockProps> = ({ attributes, element, children }) => {
  const [userResponse, setUserResponse] = useState(element?.value ?? '')

  const ref = useRef(null)

  const selected = useSelected()
  const { params } = useRouting()
  const { queryIndex } = useSearch()
  const editor = usePlateEditorRef()
  const { saveNodeName } = useLoad()
  const { setSuggestions, setHeadingQASearch } = useSuggestionStore()

  const setInfobarMode = useLayoutStore((store) => store.setInfobarMode)

  useEffect(() => {
    const node = ref.current
    if (node && selected) {
      node.focus()
    }

    setHeadingQASearch(selected)
  }, [selected])

  const goToNextLine = () => {
    // * Go to next line
    const n = Editor.next(editor)

    if (n) {
      selectEditor(editor, { at: n[1], focus: true })
    } else {
      insertNodes(editor, defaultContent.content)
      selectEditor(editor, { focus: true })
    }
  }

  const saveAnswer = (value: string) => {
    const path = ReactEditor.findPath(editor, element)
    if (editor) {
      const question = { questionId: element.questionId, question: element.question, value }
      setNodes(editor, question, { at: path })
    }
  }

  const onKeyDown = (event) => {
    if (event.key === KEYBOARD_KEYS.Enter) {
      event.preventDefault()
      // TODO: save Draft node name
      if (userResponse) {
        const title = getSlug(userResponse)
        saveNodeName(params.nodeid, title)
        goToNextLine()
      } else {
        deleteFragment(editor, { at: editor.selection, unit: 'block' })
        insertNodes(editor, defaultContent.content)
        selectEditor(editor, { focus: true })
      }
    }

    if (event.key === KEYBOARD_KEYS.ArrowDown) {
      event.preventDefault()
      goToNextLine()
    }
  }

  const getTemplateSuggestions = useDebouncedCallback((value: string) => {
    if (value) {
      // * Search for template suggestions
      saveAnswer(value)
      const keywords = sw.removeStopwords(value.split(' ').filter(Boolean))
      queryIndex('snippet', keywords.join(' '), ['template']).then((results) => {
        const mapped = results.map((result) => ({ ...result, type: 'template' }))

        setSuggestions(mapped)
        setInfobarMode('suggestions')
      })
    } else {
      setInfobarMode('default')
    }
  }, 400)

  const onChange = (event) => {
    const value = event.target.value

    setUserResponse(value)
    getTemplateSuggestions(value)
  }

  const question = element?.question

  return (
    <RootElement {...attributes}>
      <QuestionInput contentEditable={false}>
        <InputBlock
          tabIndex={-1}
          required
          onClick={(ev) => {
            ev.stopPropagation()
            mog('SELECTION', { selected })
          }}
          type="text"
          onKeyDown={onKeyDown}
          value={userResponse}
          ref={ref}
          onChange={onChange}
        />
        <span className="placeholder">{question}</span>
      </QuestionInput>
      {children}
    </RootElement>
  )
}

export default QABlock
