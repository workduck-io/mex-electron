import { getDefaultContent } from '@components/spotlight/Preview'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { useNamespaces } from '@hooks/useNamespaces'
import { useSnippets } from '@hooks/useSnippets'
import { useEditorStore } from '@store/useEditorStore'
import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { useSnippetStore } from '@store/useSnippetStore'
import { ROUTE_PATHS, useRouting, NavigationType } from '@views/routes/urls'
import { ELEMENT_PARAGRAPH, ELEMENT_TODO_LI, generateSnippetId, generateTempId } from '@workduck-io/mex-utils'
import toast from 'react-hot-toast'
import InteractiveToast from '@ui/components/InteractiveToast'
import React from 'react'
import generateName from 'project-name-generator'
import { useLayoutStore } from '@store/useLayoutStore'
import { createDefaultTodo } from '@editor/Plugins/todoUtils'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { useTaskFromSelection } from '@hooks/useTaskFromSelection'

export const useOnNewItem = () => {
  const ICONS = {
    snippet: 'ri:quill-pen-line',
    note: 'ri:file-list-2-line',
    space: 'heroicons-outline:view-grid',
    todo: 'ri:task-line'
  }

  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const changeSpace = useUserPreferenceStore((store) => store.setActiveNamespace)

  const { goTo } = useRouting()
  const { addSnippet } = useSnippets()
  const { createNewNote } = useCreateNewNote()
  const { getNewTaskNode } = useTaskFromSelection()
  const { addDefaultNewNamespace, getDefaultNamespaceId } = useNamespaces()
  const expandSidebar = useLayoutStore((store) => store.expandSidebar)

  const openModal = useModalStore((store) => store.toggleOpen)

  const onNewNote = (spaceId: string) => {
    const note = createNewNote({ namespace: spaceId })

    if (note) goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
  }

  const onNewTask = () => {
    const dailyTasksNoteId = getNewTaskNode(true)?.nodeid
    const todo = createDefaultTodo(dailyTasksNoteId, [
      {
        type: ELEMENT_TODO_LI,
        children: [{ text: '', type: ELEMENT_PARAGRAPH, id: generateTempId() }],
        id: generateTempId()
      }
    ])

    openModal(ModalsType.todo, todo)
  }

  const onNewSnippet = () => {
    const snippetId = generateSnippetId()
    const snippetName = generateName().dashed

    addSnippet({
      id: snippetId,
      title: snippetName,
      icon: ICONS.snippet,
      content: [getDefaultContent()]
    })

    loadSnippet(snippetId)

    goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetId, { title: snippetName })
  }

  const onNewSpace = () => {
    addDefaultNewNamespace()
      .then((space) => {
        if (space) {
          changeSpace(space.id)
          const openedNote = useEditorStore.getState().node.nodeid
          if (openedNote) goTo(ROUTE_PATHS.node, NavigationType.push, openedNote)
        }
        return space
      })
      .then((ns) => {
        toast.custom((t) => (
          <InteractiveToast
            tid={t.id}
            message={`Created new space: ${ns?.name}`}
            actionName="Open"
            onClick={() => {
              if (ns) changeSpace(ns.id)
              expandSidebar()
            }}
          />
        ))
      })
  }

  const getQuickNewItems = () => {
    const data = {
      note: {
        id: 0,
        name: 'New Note',
        icon: ICONS.note,
        onSelect: () => {
          const activeNamesapce = useUserPreferenceStore.getState().activeNamespace
          const spaceId = activeNamesapce ?? getDefaultNamespaceId()

          onNewNote(spaceId)
        }
      },
      space: {
        id: 1,
        name: 'New Space',
        icon: ICONS.space,
        onSelect: onNewSpace
      },
      task: {
        id: 2,
        name: 'New Task',
        icon: ICONS.todo,
        onSelect: onNewTask
      },
      snippet: {
        id: 3,
        name: 'New Snippet',
        icon: ICONS.snippet,
        onSelect: onNewSnippet
      }
    }


    return data
  }

  return {
    getQuickNewItems
  }
}
