import useDataStore from '../Editor/Store/DataStore'
import { extractSnippetCommands } from '../Snippets/useSnippets'
import { generateComboTexts } from '../Editor/Store/sampleTags'
import { defaultCommands } from '../Defaults/slashCommands'
import { uniq } from 'lodash'

import { useSnippetStore } from '../Editor/Store/SnippetStore'

export const useUpdater = () => {
  const setSlashCommands = useDataStore((state) => state.setSlashCommands)

  const updater = () => {
    const snippetCommands = extractSnippetCommands(useSnippetStore.getState().snippets)
    const commands = generateComboTexts(uniq([...snippetCommands, ...defaultCommands]))

    console.log('Generated', { commands })
    setSlashCommands(Array.from(commands))
  }

  return { updater }
}
