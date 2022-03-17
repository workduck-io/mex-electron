import { SEPARATOR } from '../components/mex/Sidebar/treeUtils'
import { useSnippetStore, Snippet } from '../store/useSnippetStore'
import { SlashCommandConfig } from '../editor/Components/SlashCommands/Types'
import { convertEntryToRawText } from '../utils/search/parseData'
import { useSearch } from './useSearch'

export const useSnippets = () => {
  const addSnippetZus = useSnippetStore((state) => state.addSnippet)
  const updateSnippetZus = useSnippetStore((state) => state.updateSnippet)
  const deleteSnippetZus = useSnippetStore((state) => state.deleteSnippet)

  const { updateDocument, removeDocument } = useSearch()

  const getSnippets = () => {
    return useSnippetStore.getState().snippets
  }

  const getSnippetsConfigs = (): { [key: string]: SlashCommandConfig } => {
    const snippets = useSnippetStore.getState().snippets
    return snippets.reduce((prev, cur) => {
      const snipCommand = getSnippetCommand(cur.title)
      return {
        ...prev,
        [snipCommand]: {
          slateElementType: '__SPECIAL__SNIPPETS',
          command: snipCommand
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
    const snippet = snippets.filter((c) => getSnippetCommand(c.title) === command)

    if (snippet.length > 0) return snippet[0].content
    return undefined
  }

  const updateSnippet = async (snippet: Snippet) => {
    updateSnippetZus(snippet.id, snippet)
    await updateDocument('snippet', convertEntryToRawText(snippet.id, snippet.content, snippet.title))
  }
  const deleteSnippet = async (id: string) => {
    deleteSnippetZus(id)
    await removeDocument('snippet', id)
  }
  const addSnippet = async (snippet: Snippet) => {
    addSnippetZus(snippet)
    await updateDocument('snippet', convertEntryToRawText(snippet.id, snippet.content, snippet.title))
  }

  return { getSnippets, getSnippet, getSnippetContent, getSnippetsConfigs, addSnippet, updateSnippet, deleteSnippet }
}

export const extractSnippetCommands = (snippets: Snippet[]): string[] => {
  return snippets.map((c) => getSnippetCommand(c.title))
}

export const SnippetCommandPrefix = `snip`
export const getSnippetCommand = (title: string) => `${SnippetCommandPrefix}${SEPARATOR}${title}`
