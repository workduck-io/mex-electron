import { SlashCommandConfig } from '../Editor/Components/SlashCommands/Types'
import { isElder } from '../Components/Sidebar/treeUtils'
import { Contents, useContentStore } from '../Editor/Store/ContentStore'

export const useSnippets = () => {
  const getSnippets = () => {
    const contents = useContentStore.getState().contents
    return extractSnippetIdsFromContent(contents)
  }

  const getSnippetsConfigs = (): { [key: string]: SlashCommandConfig } => {
    const contents = useContentStore.getState().contents
    return extractSnippetIdsFromContent(contents).reduce(
      (prev, cur) => ({
        ...prev,
        [cur]: {
          slateElementType: '__SPECIAL__SNIPPETS',
          command: cur
        }
      }),
      {}
    )
  }

  // Replacer that will provide new fresh and different content each time
  const getSnippetContent = (id: string) => {
    const contents = useContentStore.getState().contents
    const snippet = Object.keys(contents)
      .filter((c) => c === id)
      .map((c) => ({ id: c, contents: contents[c] }))

    if (snippet.length > 0) return snippet[0].contents.content
    return undefined
  }

  return { getSnippets, getSnippetContent, getSnippetsConfigs }
}

export const extractSnippetIdsFromContent = (contents: Contents) => {
  return Object.keys(contents).filter((c) => isElder(c, 'snip'))
}
