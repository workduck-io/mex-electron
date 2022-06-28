import { RootElement } from '../SyncBlock'
import React, { useEffect, useRef, useState } from 'react'
import { InputBlock } from '../../../style/Form'
import { useDebouncedCallback } from 'use-debounce'
import { useLayoutStore } from '../../../store/useLayoutStore'
import { mog } from '../../../utils/lib/helper'
import { useSearch } from '../../../hooks/useSearch'
import chat from '@iconify/icons-ph/chats-circle-bold'

import { ReactEditor, useReadOnly, useSelected } from 'slate-react'
import { Editor } from 'slate'
import { deleteFragment, insertNodes, selectEditor, setNodes, usePlateEditorRef } from '@udecode/plate'
import { KEYBOARD_KEYS } from '../../../components/spotlight/Home/components/List'
import { QuestionInput } from './styled'
import { useRouting } from '../../../views/routes/urls'
import { defaultContent } from '../../../data/Defaults/baseData'
import { getSlug } from '../../../utils/lib/strings'
import { MexIcon } from '../../../style/Layouts'
import { useTheme } from 'styled-components'
import { SNIPPET_PREFIX } from '../../../data/Defaults/idPrefixes'
import { SuggestionElementType } from '../../../components/mex/Suggestions/types'

import { removeStopwords } from '../../../utils/stopwords'
import useLoad from '@hooks/useLoad'
import useSuggestionStore from '@store/useSuggestionStore'
import { useApi } from '@apis/useSaveApi'

interface QABlockProps {
  attributes: any
  element: any
}

const QABlock: React.FC<QABlockProps> = ({ attributes, element, children }) => {
  const [userResponse, setUserResponse] = useState(element?.answer ?? '')

  const ref = useRef(null)

  const theme = useTheme()
  const selected = useSelected()
  const readOnly = useReadOnly()
  const { params } = useRouting()
  const { queryIndexWithRanking } = useSearch()
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

    return () => setHeadingQASearch(false)
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

  const goToPreviousLine = () => {
    const prev = Editor.previous(editor)
    if (prev) selectEditor(editor, { at: prev[1], focus: true })
  }

  // Differentiate between node and snippet
  const getSuggestionType = (id: string): SuggestionElementType => {
    if (id.startsWith(SNIPPET_PREFIX)) {
      return 'snippet'
    }

    return 'node'
  }

  const saveAnswer = (answer: string) => {
    const path = ReactEditor.findPath(editor, element)
    if (editor) {
      const question = { questionId: element.questionId, question: element.question, answer }
      setNodes(editor, question, { at: path })
    }
  }

  const onKeyDown = (event) => {
    if (event.key === KEYBOARD_KEYS.Enter) {
      event.preventDefault()
      const isHeadingBlock = Editor.previous(editor) === undefined

      // TODO: save Draft node name
      if (userResponse) {
        if (isHeadingBlock) {
          const title = getSlug(userResponse)
          saveNodeName(params.nodeid, title)
        }
        goToNextLine()
      } else {
        deleteFragment(editor, { at: editor.selection, unit: 'block' })
        insertNodes(editor, defaultContent.content)
        selectEditor(editor, { focus: true })
      }
    }

    if (event.key === KEYBOARD_KEYS.ArrowUp) {
      event.preventDefault()
      goToPreviousLine()
    }

    if (event.key === KEYBOARD_KEYS.ArrowDown) {
      event.preventDefault()
      goToNextLine()
    }
  }

  const getSuggestions = (value: string) => {
    const keywords = removeStopwords(value)
    const query = keywords.join(' ')

    mog('StopWords', { query })

    const isHeadingBlock = Editor.previous(editor) === undefined

    if (isHeadingBlock) {
      queryIndexWithRanking('template', query).then((results) => {
        const templates = results.map((result) => ({ ...result, type: 'template' }))
        mog('HeaderQA', { templates, results })
        setSuggestions(templates)
        setInfobarMode('suggestions')
      })
    } else {
      queryIndexWithRanking(['snippet', 'node'], query).then((results) => {
        const res = results.map((res) => ({ ...res, type: getSuggestionType(res.id) }))

        // const withoutTemplates = res.filter((r) => r.type !== 'template')
        mog('NotHeaderQA', { results })
        setSuggestions(res)
        setInfobarMode('suggestions')
      })
    }
  }

  const onDelayPerform = useDebouncedCallback((value: string) => {
    if (value) {
      // * Search for template suggestions
      saveAnswer(value)
      setHeadingQASearch(true)
      getSuggestions(value)
    } else {
      setInfobarMode('default')
    }
  }, 400)

  const onChange = (event) => {
    const value = event.target.value

    setUserResponse(value)
    onDelayPerform(value)
  }

  const question = element?.question

  return (
    <RootElement {...attributes}>
      <QuestionInput selected={!readOnly && selected} contentEditable={false}>
        <InputBlock
          tabIndex={-1}
          required
          onClick={(ev) => {
            ev.stopPropagation()
          }}
          readOnly={readOnly}
          type="text"
          onKeyDown={onKeyDown}
          value={userResponse}
          ref={ref}
          onChange={onChange}
        />
        <span className="placeholder">
          <MexIcon icon={chat} fontSize={16} color={theme.colors.primary} margin="0 0.25rem 0 0" />
          {question}
        </span>
      </QuestionInput>
      {children}
    </RootElement>
  )
}

export default QABlock
