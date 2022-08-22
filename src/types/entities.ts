import { ELEMENT_TODO_LI } from '@udecode/plate'
import { NodeEditorContent } from './Types'

export enum EntityTypes {
  TASK = 'TASK',
  NODE = 'NODE',
  ACTION = 'ACTION',
  REMINDER = 'REMINDER'
}

export const EntityElements = [ELEMENT_TODO_LI]

export type TodoEntity = {
  entityId: string
  blockId?: string
  nodeId?: string
  properties: Record<string, any>
  content: NodeEditorContent
}
