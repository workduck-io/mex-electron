import { useApi } from '@apis/useSaveApi'
import { runBatch } from '@utils/lib/batchPromise'
import { mog } from '@utils/lib/helper'
import { serializeTodo } from '@utils/lib/serialize'

import { FileData } from '../types/data'
import useEntityAPIs from './useEntityAPIs'
import { useTodoBuffer } from './useTodoBuffer'

export const useFileSaveBuffer = () => {
  const { saveView } = useApi()
  const { updateTodos } = useEntityAPIs()

  const saveFileBuffer = async (data: FileData) => {
    if (data.saveBuffer) {
      const todosBuffer = data.saveBuffer?.todosBuffer

      if (todosBuffer) {
        const requests = []
        
        Object.entries(todosBuffer).forEach(([noteId, todos]) => {
          if (noteId && todos) {
            const noteTodos = Object.values(todos)?.map(t => serializeTodo({...t, type: 'UPDATE'}))
            if (noteTodos?.length > 0) {
              requests.push(updateTodos(noteTodos))
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
