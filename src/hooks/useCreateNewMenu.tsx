import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { defaultContent } from '@data/Defaults/baseData'
import { generateSnippetId } from '@data/Defaults/idPrefixes'
import { IconifyIcon } from '@iconify/react'
import generateName from 'project-name-generator'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { useCreateNewNote } from './useCreateNewNote'
import { useUpdater } from './useUpdater'
import { useSnippetStore } from '@store/useSnippetStore'
import { useSnippets } from './useSnippets'
import { useNamespaces } from './useNamespaces'
import { useUserPreferenceStore } from '@store/userPreferenceStore'

interface CreateNewMenuItem {
  id: string
  label: string
  icon?: string | IconifyIcon
  onSelect: () => void
}

export const useCreateNewMenu = () => {
  const { goTo } = useRouting()
  const { createNewNote } = useCreateNewNote()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { addSnippet } = useSnippets()
  const { updater } = useUpdater()
  const { addDefaultNewNamespace, getDefaultNamespaceId } = useNamespaces()
  const currentSpace = useUserPreferenceStore((store) => store.activeNamespace)
  const changeSpace = useUserPreferenceStore((store) => store.setActiveNamespace)

  const createNewNamespace = () => {
    addDefaultNewNamespace().then((ns) => {
      if (ns) changeSpace(ns.id)
    })
  }

  const createNewNoteInNamespace = (namespaceId: string) => {
    const note = createNewNote({ namespace: namespaceId, noteContent: defaultContent.content })

    if (note) {
      goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
    }
  }

  const onCreateNewSnippet = () => {
    // Create a better way.
    const snippetId = generateSnippetId()
    const snippetName = generateName().dashed

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

  const getCreateNewMenuItems = (_path: string): CreateNewMenuItem[] => {
    return [
      {
        id: 'new-note',
        label: 'New Note',
        onSelect: () => {
          createNewNoteInNamespace(currentSpace || getDefaultNamespaceId())
        }
      },
      {
        id: 'new-space',
        label: 'New Space',
        onSelect: () => {
          createNewNamespace()
        }
      },
      {
        id: 'new-snippet',
        label: 'New Snippet',
        onSelect: () => {
          onCreateNewSnippet()
        }
      }
    ]
  }

  return { getCreateNewMenuItems }
}
