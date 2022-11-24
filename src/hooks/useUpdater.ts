import { useContentStore } from '@store/useContentStore'
import useTodoStore from '@store/useTodoStore'
import { getTodosFromContent } from '@utils/lib/content'

import useDataStore from '../store/useDataStore'
import { useSnippetStore } from '../store/useSnippetStore'
import { NodeEditorContent } from '../types/Types'
import { useLinks } from './useLinks'
import { useSearch } from './useSearch'
import { useSlashCommands } from './useSlashCommands'
import { useTags } from './useTags'

export const useUpdater = () => {
  const setSlashCommands = useDataStore((state) => state.setSlashCommands)
  const setContent = useContentStore((store) => store.setContent)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const { generateSlashCommands } = useSlashCommands()

  const updater = () => {
    const slashCommands = generateSlashCommands(useSnippetStore.getState().snippets)

    setSlashCommands(slashCommands)
  }

  const { updateLinksFromContent, getTitleFromNoteId } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)

  const { updateTagsFromContent } = useTags()
  const { updateDocument } = useSearch()

  const updateFromContent = async (noteId: string, content: NodeEditorContent, metadata?: any) => {
    if (content) {
      setContent(noteId, content)
      setMetadata(noteId, metadata)
      updateLinksFromContent(noteId, content)
      updateTagsFromContent(noteId, content)
      updateNodeTodos(noteId, getTodosFromContent(content))

      updateDocument(
        'node',
        noteId,
        content,
        getTitleFromNoteId(noteId, { includeArchived: true, includeShared: true })
      )
    }
  }

  return { updater, updateFromContent }
}
