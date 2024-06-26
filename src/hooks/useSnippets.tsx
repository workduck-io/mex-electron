import { useApi } from '@apis/useSaveApi'
import { mog } from '@utils/lib/mog'

import { SEPARATOR } from '../components/mex/Sidebar/treeUtils'
import { SlashCommandConfig } from '../editor/Components/SlashCommands/Types'
import { useSnippetStore, Snippet } from '../store/useSnippetStore'
import { useSearch } from './useSearch'

export const useSnippets = () => {
  const addSnippetZus = useSnippetStore((state) => state.addSnippet)
  const updateSnippetZus = useSnippetStore((state) => state.updateSnippet)
  const deleteSnippetZus = useSnippetStore((state) => state.deleteSnippet)

  const { updateDocument, removeDocument } = useSearch()
  const { deleteSnippetById } = useApi()

  const getSnippets = () => {
    return useSnippetStore.getState().snippets
  }

  const getSnippetsConfigs = (): { [key: string]: SlashCommandConfig } => {
    const snippets = useSnippetStore.getState().snippets
    return snippets.reduce((prev, cur) => {
      const snipCommand = getSnippetCommand(cur)
      return {
        ...prev,
        [snipCommand.command]: {
          slateElementType: '__SPECIAL__SNIPPETS',
          command: snipCommand.command,
          extras: snipCommand.data
        }
      }
    }, {})
  }

  const getSnippet = (id: string) => {
    const snippets = useSnippetStore.getState().snippets
    const snippet = snippets.filter((c) => c.id === id)

    if (snippet.length > 0) return snippet[0]
    return undefined
  }

  // Replacer that will provide new fresh and different content each time
  const getSnippetContent = (command: string) => {
    const snippets = useSnippetStore.getState().snippets
    const snippet = snippets.filter((c) => getSnippetCommand(c).command === command)

    if (snippet.length > 0) return snippet[0].content
    return undefined
  }

  const updateSnippet = async (snippet: Snippet) => {
    updateSnippetZus(snippet.id, snippet)
    const tags = snippet.template ? ['template'] : ['snippet']
    const idxName = snippet.template ? 'template' : 'snippet'
    mog('Update snippet', { snippet, tags })
    if (snippet.template) {
      await removeDocument('snippet', snippet.id)
    } else {
      await removeDocument('template', snippet.id)
    }
    await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)
  }

  const deleteSnippet = async (id: string) => {
    const res = await deleteSnippetById(id)
    if (res) {
      deleteSnippetZus(id)
      await removeDocument('snippet', id)
    }
  }

  const addSnippet = async (snippet: Snippet) => {
    addSnippetZus(snippet)
    const tags = snippet.template ? ['template'] : ['snippet']
    const idxName = snippet.template ? 'template' : 'snippet'
    mog('Add snippet', { snippet, tags })

    await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)
  }

  return {
    getSnippets,
    getSnippet,
    getSnippetContent,
    getSnippetsConfigs,
    addSnippet,
    updateSnippet,
    deleteSnippet
  }
}

export const extractSnippetCommands = (snippets: Snippet[]): { command: string; data?: any }[] => {
  return snippets.map((c) => getSnippetCommand(c))
}

export const SnippetCommandPrefix = `snip`
export const getSnippetCommand = (snippet: Snippet) => ({
  command: `${SnippetCommandPrefix}${SEPARATOR}${snippet.title}`,
  data: snippet
})
