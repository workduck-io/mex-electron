import { NodeProperties } from '../store/useEditorStore'
import { NodeEditorContent } from '../types/Types'
import TreeNode from './tree'

export interface EditorStateProps {
  // Data of the current node
  node: NodeProperties
  // Contents of the current node
  // These are loaded internally from ID
  content: NodeEditorContent
}

export type EditorContextType = {
  // State
  state: EditorStateProps | null
  // State transformations
  // Load a node and its contents in the editor
  loadNode: (node: TreeNode) => void
}
