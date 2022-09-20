import { useContentStore } from '@store/useContentStore'
import useTodoStore from '@store/useTodoStore'

import { client } from '@workduck-io/dwindle'

import { integrationURLs } from '../apis/routes'
import { Service, SyncBlockTemplate } from '../editor/Components/SyncBlock'
import { TodoType } from '../editor/Components/Todo/types'
import { useAuthStore } from '../services/auth/useAuth'
import useDataStore from '../store/useDataStore'
import useOnboard from '../store/useOnboarding'
import { useSnippetStore } from '../store/useSnippetStore'
import { useSyncStore } from '../store/useSyncStore'
import { NodeEditorContent } from '../types/Types'
import { useBufferStore } from './useEditorBuffer'
import { useLinks } from './useLinks'
import { useSaveData } from './useSaveData'
import { useSearch } from './useSearch'
import { useSlashCommands } from './useSlashCommands'
import { useTags } from './useTags'

export const useUpdater = () => {
  const setSlashCommands = useDataStore((state) => state.setSlashCommands)
  const setContent = useContentStore((store) => store.setContent)
  const setServices = useSyncStore((store) => store.setServices)
  const setTemplates = useSyncStore((store) => store.setTemplates)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const getNoteContent = useContentStore((store) => store.getContent)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const add2Buffer = useBufferStore((s) => s.add)

  const { saveData } = useSaveData()
  const { generateSlashCommands } = useSlashCommands()

  const updater = () => {
    const slashCommands = generateSlashCommands(useSnippetStore.getState().snippets, useSyncStore.getState().templates)

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

      updateDocument(
        'node',
        noteId,
        content,
        getTitleFromNoteId(noteId, { includeArchived: true, includeShared: true })
      )
    }
  }

  const updateTodoInContent = (noteId: string, todos: Array<TodoType>, bufferEditorContent = false) => {
    const nodeContent = getNoteContent(noteId)

    if (nodeContent.content) {
      const todosToReplace = [...todos]
      const newContent = nodeContent.content?.map((block) => {
        const todoIndex = todosToReplace?.findIndex((td) => td.entityId === block.entityId)
        if (todoIndex >= 0) {
          const todo = todosToReplace[todoIndex]
          todosToReplace.splice(todoIndex, 1)
          return todo.content[0]
        }

        return block
      })

      const newTodoContent = todosToReplace?.length > 0 ? todosToReplace.map((todo) => todo.content[0]) : []
      const contentWithNewTodos = [...newContent, ...newTodoContent]

      if (bufferEditorContent) {
        add2Buffer(noteId, contentWithNewTodos)
      } else {
        setContent(noteId, contentWithNewTodos)
      }

      // const currentNode = useEditorStore.getState().node

      // if (currentNode.nodeid === noteId) {
      //   setContent(currentNode.nodeid, contentWithNewTodos)
      // }
    }
  }

  const updateDefaultServices = async <T>(d?: T): Promise<T | undefined> => {
    if (useAuthStore.getState().authenticated && !isOnboarding) {
      await client
        .get(integrationURLs.getAllServiceData(getWorkspaceId()))
        .then((d) => {
          const data = d.data
          // console.log({ data })
          const services: Service[] = data.map((s) => ({
            id: s.serviceType,
            name: s.name,
            type: s.intentTypes[0],
            imageUrl: s.imageUrl,
            description: s.description,
            authUrl: s.authUrl,
            connected: false,
            enabled: s.enabled
          }))

          setServices(services)
        })
        .then(() => saveData())
    } else console.error('Not authenticated, not fetching default services')
    return d
  }

  const updateServices = async <T>(d?: T): Promise<T | undefined> => {
    if (useAuthStore.getState().authenticated && !isOnboarding) {
      await client
        .get(integrationURLs.getWorkspaceAuth(getWorkspaceId()))
        .then((d) => {
          const services = useSyncStore.getState().services
          const sData = d.data
          const newServices = services.map((s) => {
            if (s.id === 'ONBOARD') return s
            const connected = sData.some((cs) => s.id === cs.type)
            return { ...s, connected }
          })

          setServices(newServices)
        })
        .then(() => saveData())
        .catch(console.error)
    } else console.error('Not authenticated, not fetching workspace services')
    return d
  }

  const getTemplates = async () => {
    if (useAuthStore.getState().authenticated) {
      await client
        .get(integrationURLs.getAllTemplates(getWorkspaceId()))
        .then((d) => {
          const data = d.data

          const templates: SyncBlockTemplate[] = data.map((s) => ({
            id: s.templateId,
            title: s.title,
            command: s.command,
            description: s.description,
            intents: Object.keys(s.intentMap).map((key) => ({
              service: key,
              type: s.intentMap[key]
            }))
          }))

          setTemplates(templates)
        })
        .then(() => saveData())
    } else console.error('Not authenticated, not fetching default services')
  }

  return { updater, updateTodoInContent, updateServices, updateFromContent, getTemplates, updateDefaultServices }
}
