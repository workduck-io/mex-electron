import { uniq } from 'lodash'
import { defaultCommands } from '../data/Defaults/slashCommands'
import { extractSyncBlockCommands } from '../editor/Components/SlashCommands/useSyncConfig'
import { Snippet } from '../store/useSnippetStore'
import { generateIconComboTexts, addIconToString } from '../utils/generateComboItem'
import { SyncBlockTemplate } from '../editor/Components/SyncBlock'
import { extractSnippetCommands } from './useSnippets'

export const useSlashCommands = () => {
  const generateSlashCommands = (snippets: Snippet[], templates: SyncBlockTemplate[]) => {
    const snippetCommands = extractSnippetCommands(snippets)
    const syncCommands = extractSyncBlockCommands(templates)

    const commands = generateIconComboTexts(
      uniq([
        ...addIconToString(snippetCommands, 'ri:quill-pen-line'),
        ...addIconToString(syncCommands, 'ri:refresh-fill'),
        ...defaultCommands
      ])
    )

    return Array.from(commands)
  }

  return { generateSlashCommands }
}
