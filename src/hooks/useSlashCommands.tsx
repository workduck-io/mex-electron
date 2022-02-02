import { uniq } from 'lodash'
import { defaultCommands } from '../data/Defaults/slashCommands'
import { extractSyncBlockCommands } from '../editor/Components/SlashCommands/useSyncConfig'
import { SyncBlockTemplate } from '../editor/Components/SyncBlock'
import { Snippet } from '../store/useSnippetStore'
import { SlashCommand } from '../types/Types'
import { addIconToSlashCommand, generatorCombo } from '../utils/generateComboItem'
import { extractSnippetCommands } from './useSnippets'

export const useSlashCommands = () => {
  const generateInternalSlashCommands = (snippets: Snippet[], templates: SyncBlockTemplate[]) => {
    const snippetCommands = extractSnippetCommands(snippets)
    const syncCommands = extractSyncBlockCommands(templates)

    const commands: SlashCommand[] = generatorCombo(
      uniq([
        ...addIconToSlashCommand(
          snippetCommands.map((command) => ({ command })),
          'ri:quill-pen-line'
        ),
        ...addIconToSlashCommand(
          syncCommands.map((command) => ({ command })),
          'ri:refresh-fill'
        )
      ])
    )

    return Array.from(commands)
  }
  const generateDefaultSlashCommands = () => {
    const commands: SlashCommand[] = generatorCombo([...defaultCommands])

    return Array.from(commands)
  }

  const generateSlashCommands = (snippets: Snippet[], templates: SyncBlockTemplate[]) => {
    return {
      internal: generateInternalSlashCommands(snippets, templates),
      default: generateDefaultSlashCommands()
    }
  }
  return { generateInternalSlashCommands, generateSlashCommands, generateDefaultSlashCommands }
}
