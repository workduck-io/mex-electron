//add this script in myWorker.js file
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6 } from '@udecode/plate'
import { parentPort, workerData } from 'worker_threads'
import { NodeAnalysis, OutlineItem } from '../../store/useAnalysis'
import { NodeEditorContent } from '../../types/Types'
import { convertContentToRawText } from '../../utils/search/localSearch'
// import { parentPort, workerData } from 'worker_threads'

// parentPort.postMessage(analyseData(workerData.content))

parentPort.on('message', (data) => {
  console.log('Exec on message', { data })
  parentPort.postMessage(analyseData(data))
})

const ELEMENTS_IN_OUTLINE = [ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6]

const getOutline = (content: NodeEditorContent): OutlineItem[] => {
  if (!content) return []
  const outline: OutlineItem[] = []
  content.forEach((item) => {
    if (ELEMENTS_IN_OUTLINE.includes(item.type)) {
      outline.push({
        type: item.type,
        title: convertContentToRawText(item.children, ' '),
        id: item.id,
        level: ELEMENTS_IN_OUTLINE.indexOf(item.type) + 1
      })
    }
  })
  return outline
}

function analyseData(content: NodeEditorContent): NodeAnalysis {
  if (!content)
    return {
      outline: [],
      tags: []
    }
  // console.log('Analuse', content)
  return {
    outline: getOutline(content),
    tags: []
  }
}
