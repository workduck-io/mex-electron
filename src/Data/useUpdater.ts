import { useContentStore } from '../Editor/Store/ContentStore'
import useDataStore from '../Editor/Store/DataStore'
import { extractSnippetIdsFromContent } from '../Snippets/useSnippets'
import { generateComboTexts } from '../Editor/Store/sampleTags'
import { defaultCommands } from '../Defaults/slashCommands'
import { uniq } from 'lodash'

export const useUpdater = () => {
  const setSlashCommands = useDataStore((state) => state.setSlashCommands)

  const updater = () => {
    const commands = generateComboTexts(
      uniq([...extractSnippetIdsFromContent(useContentStore.getState().contents), ...defaultCommands])
    )

    console.log('Generated', { commands })
    setSlashCommands(Array.from(commands))
  }

  return { updater }
}
