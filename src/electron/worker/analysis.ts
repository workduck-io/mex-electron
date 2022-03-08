import { NodeAnalysis, OutlineItem } from '../../store/useAnalysis'
import { NodeEditorContent } from '../../types/Types'
import { convertContentToRawText } from '../../utils/search/localSearch'
import { expose } from 'threads/worker'
import { getTagsFromContent } from '../../utils/lib/content'
// import { parentPort, workerData } from 'worker_threads'

// parentPort.postMessage(analyseData(workerData.content))

const ELEMENTS_IN_OUTLINE = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

const getOutline = (content: NodeEditorContent): OutlineItem[] => {
  if (!content) return []
  const outline: OutlineItem[] = []
  content.forEach((item) => {
    if (ELEMENTS_IN_OUTLINE.includes(item.type.toLowerCase())) {
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

function analyseContent(content: NodeEditorContent): NodeAnalysis {
  if (!content)
    return {
      outline: [],
      tags: []
    }
  // console.log('Analuse', content)
  return {
    outline: getOutline(content),
    tags: getTagsFromContent(content)
  }
}

expose({ analyseContent })
