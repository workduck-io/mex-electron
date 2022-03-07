import { Worker } from 'worker_threads'
import { NodeEditorContent } from '../../types/Types'

export const WORKER_LOCATION = './src/electron/worker'
export let worker: null | Worker = null

export const startAnalysisWorkerService = () => {
  console.log('startWorkerService', {})
  return new Promise((resolve, reject) => {
    if (!worker) worker = new Worker(`${WORKER_LOCATION}/analysis.import.js`)
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`stopped with  ${code} exit code`))
    })
  })
}

export const analyseContent = async (content: NodeEditorContent, callback: (data: any) => void) => {
  if (!worker) await startAnalysisWorkerService()
  worker.postMessage(content)
  worker.on('message', (data) => {
    console.log('worker message', { data })
    callback(data)
  })
}
