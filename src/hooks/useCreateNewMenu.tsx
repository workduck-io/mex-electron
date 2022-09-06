import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { getRandomQAContent } from '@data/Defaults/baseData'
import { generateSnippetId } from '@data/Defaults/idPrefixes'
import { IconifyIcon } from '@iconify/react'
import generateName from 'project-name-generator'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { useCreateNewNote } from './useCreateNewNote'
import { useUpdater } from './useUpdater'
import { useSnippetStore } from '@store/useSnippetStore'
import { useSnippets } from './useSnippets'

interface CreateNewMenuItem {
  id: string
  label: string
  icon?: string | IconifyIcon
  onSelect: () => void
}

// TODO: Add ordering and filtering based on Path
interface CreateNewMenuConfig {
  // If passed, and the path matches/starts with this path
  // The menu item is moved above
  path?: string
}

export const useCreateNewMenu = () => {
  const { goTo } = useRouting()
  const { createNewNote } = useCreateNewNote()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { addSnippet } = useSnippets()
  const { updater } = useUpdater()

  const createNoteWithQABlock = () => {
    const qaContent = getRandomQAContent()
    const note = createNewNote({ noteContent: qaContent })

    goTo(ROUTE_PATHS.node, NavigationType.push, note?.nodeid)
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
  const getCreateNewMenuItems = (path: string): CreateNewMenuItem[] => {
    return [
      {
        id: 'new-note',
        label: 'New Note',
        onSelect: () => {
          createNoteWithQABlock()
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
