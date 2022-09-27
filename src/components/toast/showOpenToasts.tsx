import React from 'react'
import InteractiveToast from '@ui/components/InteractiveToast'
import toast from 'react-hot-toast'
import { useNavigation } from '@hooks/useNavigation'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { useSnippetStore } from '@store/useSnippetStore'

export const useOpenToast = () => {
  const { push } = useNavigation()
  const { goTo } = useRouting()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)

  const openNoteToast = (nodeid: string, title: string) => {
    toast.custom((t) => (
      <InteractiveToast
        tid={t.id}
        message={`Created new note: ${title}`}
        actionName="Open"
        onClick={() => {
          push(nodeid)
          goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
          // console.log('We are here')
        }}
      />
    ))
  }

  const openSnippetToast = (snippetid: string, title: string) => {
    toast.custom((t) => (
      <InteractiveToast
        tid={t.id}
        message={`Created new snippet: ${title}`}
        actionName="Open"
        onClick={() => {
          loadSnippet(snippetid)
          goTo(ROUTE_PATHS.snippet, NavigationType.push, snippetid)
          // console.log('We are here')
        }}
      />
    ))
  }

  return { openNoteToast, openSnippetToast }
}
