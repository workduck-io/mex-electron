import { uniq } from 'lodash'
import { SyncBlockTemplate } from '../editor/Components/SyncBlock'
import { defaultCommands } from '../Defaults/slashCommands'
import { extractSyncBlockCommands } from '../editor/Components/SlashCommands/useSyncConfig'
import { addIconToString, generateIconComboTexts } from '../editor/Store/sampleTags'
import { Snippet } from '../editor/Store/SnippetStore'
import { extractSnippetCommands } from '../Snippets/useSnippets'

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
