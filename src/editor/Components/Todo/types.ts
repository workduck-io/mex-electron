import { Shortcut } from '../../../components/mex/Help/Help.types'
import { NodeEditorContent } from '../../../types/Types'

export enum PriorityType {
  low = 'low',
  high = 'high',
  medium = 'medium',
  noPriority = 'noPriority'
}

export type PriorityDataType = {
  icon: string
  title: string
  shortcut: Shortcut
  type: PriorityType
}

export enum TodoStatus {
  todo,
  pending,
  completed
}

export type TodosType = Record<string, Array<TodoType>> // * nodeid, todos

export type TodoType = {
  id: string
  nodeid: string
  content: NodeEditorContent
  metadata: {
    status: TodoStatus
    priority: PriorityType
  }
  createdAt: number
  updatedAt: number
}

// * Get priority data from PriorityType
export const Priority: Record<keyof typeof PriorityType, PriorityDataType> = {
  noPriority: {
    title: 'No Priority',
    shortcut: {
      category: 'action',
      keystrokes: '$mod+4',
      title: 'No priority'
    },
    icon: 'ph:cell-signal-none-fill',
    type: PriorityType.noPriority
  },
  low: {
    title: 'Low',
    shortcut: {
      category: 'action',
      keystrokes: '$mod+3',
      title: 'Low priority'
    },
    icon: 'ph:cell-signal-low-fill',
    type: PriorityType.low
  },
  medium: {
    title: 'Medium',
    shortcut: {
      category: 'action',
      keystrokes: '$mod+2',
      title: 'Medium priority'
    },
    icon: 'ph:cell-signal-medium-fill',
    type: PriorityType.medium
  },
  high: {
    title: 'High',
    shortcut: {
      category: 'action',
      keystrokes: '$mod+1',
      title: 'Highest priority'
    },
    icon: 'ph:cell-signal-full-fill',
    type: PriorityType.high
  }
}