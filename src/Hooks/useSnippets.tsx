import { SEPARATOR } from '../components/mex/Sidebar/treeUtils'
import { useSnippetStore, Snippet } from '../store/useSnippetStore'
import { SlashCommandConfig } from '../editor/Components/SlashCommands/Types'

export const useSnippets = () => {
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

  // Replacer that will provide new fresh and different content each time
  const getSnippetContent = (command: string) => {
    const snippets = useSnippetStore.getState().snippets
    const snippet = snippets.filter((c) => getSnippetCommand(c.title) === command)

    if (snippet.length > 0) return snippet[0].content
    return undefined
  }

  return { getSnippets, getSnippetContent, getSnippetsConfigs }
}

export const extractSnippetCommands = (snippets: Snippet[]): string[] => {
  return snippets.map((c) => getSnippetCommand(c.title))
}

export const getSnippetCommand = (title: string) => `snip${SEPARATOR}${title}`
