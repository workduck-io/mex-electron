import { useApi } from '@apis/useSaveApi'
import useTodoStore from '@store/useTodoStore'
import { runBatch } from '@utils/lib/batchPromise'
import { mog } from '@utils/lib/helper'
import { serializeTodo } from '@utils/lib/serialize'

import { FileData } from '../types/data'
import useEntityAPIs from './useEntityAPIs'
import useTodoBufferStore from './useTodoBufferStore'

export const useFileSaveBuffer = () => {
  const { saveView } = useApi()
  const { updateTodos } = useEntityAPIs()
  const removeNoteBuffer = useTodoBufferStore((store) => store.remove)
  const updateTodosOfNode = useTodoStore((store) => store.updateTodosOfNode)

  const saveFileBuffer = async (data: FileData) => {
    if (data.saveBuffer) {
      const todosBuffer = data.saveBuffer?.todosBuffer

      if (todosBuffer) {
        const requests = []

        Object.entries(todosBuffer).forEach(([noteId, todos]) => {
          if (noteId && todos) {
            const noteTodos = Object.values(todos)?.map((t) => serializeTodo({ ...t, type: 'UPDATE' }))
            if (noteTodos?.length > 0) {
              requests.push(
                updateTodos(noteTodos)
                  .then((d) => {
                    mog('UPDATING TODOS', { noteId, todos })
                    updateTodosOfNode(noteId, Object.values(todos))
                    removeNoteBuffer(noteId)
                  })
                  .catch((er) => {
                    mog('Something went wrong while updating local tasks!')
                  })
              )
            }
          }
        })

        if (requests.length > 0) {
          await runBatch(requests)
        }
      }

      if (data.saveBuffer.views && data.saveBuffer.views.length > 0) {
        mog('Saving previously found views', { vw: data.saveBuffer.views })
        data.saveBuffer.views.map(saveView)
      }
    }
  }

  return { saveFileBuffer }
}
