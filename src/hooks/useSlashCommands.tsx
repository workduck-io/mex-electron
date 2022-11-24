import { uniq } from 'lodash'
import { QuickLinkType } from '../components/mex/NodeSelect/NodeSelect'
import { defaultCommands } from '../data/Defaults/slashCommands'
import { Snippet } from '../store/useSnippetStore'
import { SlashCommand } from '../types/Types'
import { addIconToSlashCommand, generatorCombo } from '../utils/generateComboItem'
import { extractSnippetCommands } from './useSnippets'

export const useSlashCommands = () => {
  const generateInternalSlashCommands = (snippets: Snippet[]) => {
    const snippetCommands = extractSnippetCommands(snippets)
    // const syncCommands = extractSyncBlockCommands(templates)

    const commands: SlashCommand[] = generatorCombo(
      uniq([
        ...addIconToSlashCommand(
          snippetCommands.map((command) => ({
            command: command.command,
            extras: command.data,
            text: command.command.replace('snip.', ''),
            type: QuickLinkType.snippet
          })),
          'ri:quill-pen-line'
        )
        // ...addIconToSlashCommand(
        //   syncCommands.map((command) => ({ command, text: command.replace('flow.', ''), type: QuickLinkType.flow })),
        //   'ri:refresh-fill'
        // )
      ])
    )

    return Array.from(commands)
  }
  const generateDefaultSlashCommands = () => {
    const commands: SlashCommand[] = generatorCombo([...defaultCommands])

    return Array.from(commands)
  }

  const generateSlashCommands = (snippets: Snippet[]) => {
    return {
      internal: generateInternalSlashCommands(snippets),
      default: generateDefaultSlashCommands()
    }
  }
  return { generateInternalSlashCommands, generateSlashCommands, generateDefaultSlashCommands }
}
