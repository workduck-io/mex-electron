import { spawn, Worker } from 'threads'
import { NodeEditorContent } from '../../types/Types'

// @ts-expect-error it don't want .ts
// eslint-disable-next-line
import workerURL from 'threads-plugin/dist/loader?name=worker!./analysis.ts'

export const WORKER_LOCATION = './src/electron/worker'
export let worker = null

export const startAnalysisWorkerService = async () => {
  console.log('startWorkerService')
  if (!worker) worker = await spawn(new Worker(workerURL))
}

export const analyseContent = async (content: NodeEditorContent, callback: (data: any) => void) => {
  if (!worker) await startAnalysisWorkerService()
  const analysis = await worker.analyseContent(content)
  callback(analysis)
}
