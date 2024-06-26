import { SlashCommand } from '../../types/Types'
import { CategoryType } from '../../store/Context/context.spotlight'

export const defaultCommands: SlashCommand[] = [
  { command: 'table', text: 'Insert Table', icon: 'ri:table-line', type: CategoryType.action },
  { command: 'canvas', text: 'Insert Drawing canvas', icon: 'ri:markup-line', type: CategoryType.action },
  { command: 'webem', text: 'Insert Web embed', icon: 'ri:global-line', type: CategoryType.action },
  { command: 'remind', text: 'Create a Reminder', icon: 'ri:timer-line', type: CategoryType.action, extended: true }
] as SlashCommand[]
