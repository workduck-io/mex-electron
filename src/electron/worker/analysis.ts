//add this script in myWorker.js file
import { parentPort, workerData } from 'worker_threads'
import { NodeEditorContent } from '../../types/Types'
// import { parentPort, workerData } from 'worker_threads'

// parentPort.postMessage(analyseData(workerData.content))

parentPort.on('message', (data) => {
  console.log('Exec on message', { data })
  parentPort.postMessage({ content: analyseData(data) })
})

function analyseData(content: NodeEditorContent) {
  if (!content) return undefined
  // console.log('Analuse', content)
  return content.map((item) => {
    return {
      ...item,
      isHeading:
        item.type === 'h1' ||
        item.type === 'h2' ||
        item.type === 'h3' ||
        item.type === 'h4' ||
        item.type === 'h5' ||
        item.type === 'h6'
    }
  })
}
