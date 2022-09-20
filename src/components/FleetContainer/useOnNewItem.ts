import { getDefaultContent } from '@components/spotlight/Preview';
import { useCreateNewNote } from '@hooks/useCreateNewNote';
import { useNamespaces } from '@hooks/useNamespaces';
import { useSnippets } from '@hooks/useSnippets';
import { useEditorStore } from '@store/useEditorStore';
import useModalStore, { ModalsType } from '@store/useModalStore';
import { useUserPreferenceStore } from '@store/userPreferenceStore';
import { useSnippetStore } from '@store/useSnippetStore';
import { ROUTE_PATHS, useRouting, NavigationType } from '@views/routes/urls';
import { generateSnippetId, mog } from '@workduck-io/mex-utils';
import generateName from 'project-name-generator'

export const useOnNewItem = () => {
  const ICONS = {
    snippet: 'ri:quill-pen-line',
    note: 'ri:file-list-2-line',
    space: 'heroicons-outline:view-grid',
    todo: 'ri:task-line'
  }

  const loadSnippet = useSnippetStore(store => store.loadSnippet)
  const changeSpace = useUserPreferenceStore(store => store.setActiveNamespace)
  const openModal = useModalStore(store => store.toggleOpen)

  const { goTo } = useRouting()
  const { addSnippet } = useSnippets()
  const { createNewNote } = useCreateNewNote()
  const { addDefaultNewNamespace, getDefaultNamespaceId } = useNamespaces()

  const onNewNote = (spaceId: string) => {
    const note = createNewNote({ namespace: spaceId })

    if (note)
      goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
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
    addDefaultNewNamespace().then(space => {
      if (space) {
        changeSpace(space.id)
        const openedNote = useEditorStore.getState().node.nodeid
        if (openedNote) goTo(ROUTE_PATHS.node, NavigationType.push, openedNote)
      }
    })
  }

  const onNewTask = () => {
    mog('Opening modal')
    openModal(ModalsType.todo)
  }

  const getQuickNewItems = () => {

    const data = [{
      id: 0,
      name: 'New Note',
      icon: ICONS.note,
      onSelect: () => {
        const activeNamesapce = useUserPreferenceStore.getState().activeNamespace
        const spaceId = activeNamesapce ?? getDefaultNamespaceId()

        onNewNote(spaceId)
      },
    }, {
      id: 1,
      name: 'New Space',
      icon: ICONS.space,
      onSelect: onNewSpace,
    },
    {
      id: 2,
      name: 'New Task',
      icon: ICONS.todo,
      onSelect: onNewTask,
    },
    {
      id: 3,
      name: 'New Snippet',
      icon: ICONS.snippet,
      onSelect: onNewSnippet,
    }]

    return data
  }

  return {
    getQuickNewItems,
  }
}
