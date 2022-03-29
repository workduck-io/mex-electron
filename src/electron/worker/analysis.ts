import { NodeAnalysis, OutlineItem } from '../../store/useAnalysis'
import { NodeEditorContent } from '../../types/Types'
import { convertContentToRawText } from '../../utils/search/parseData'
import { expose } from 'threads/worker'
import { getTagsFromContent, getTodosFromContent } from '../../utils/lib/content'
import { ELEMENTS_IN_OUTLINE, HIGHLIGHTED_ELEMENTS, LIST_ELEMENTS } from '../../data/outline'
// import { parentPort, workerData } from 'worker_threads'
// parentPort.postMessage(analyseData(workerData.content))

const getOutline = (content: NodeEditorContent): OutlineItem[] => {
  // console.log('getOutline', content)
  if (!content) return []
  const outline: OutlineItem[] = []
  let curHighlighted = ''
  let lastLevel = 1
  content.forEach((item) => {
    if (item && item.type) {
      // Headings
      if (ELEMENTS_IN_OUTLINE.includes(item.type.toLowerCase())) {
        const title = convertContentToRawText(item.children, ' ')
        if (title.trim() !== '')
          outline.push({
            type: item.type,
            title: title,
            id: item.id,
            level: ELEMENTS_IN_OUTLINE.indexOf(item.type) + 1
          })
        curHighlighted = ''
        lastLevel = ELEMENTS_IN_OUTLINE.indexOf(item.type) + 1
      } // Lists
      else if (LIST_ELEMENTS.includes(item.type.toLowerCase())) {
        if (item.children && item.children[0]) {
          const title = convertContentToRawText(item.children[0].children, ' ')
          if (title.trim() !== '')
            outline.push({
              type: item.type,
              title: title,
              id: item.id,
              level: lastLevel
            })
        }
        curHighlighted = ''
      } else if (HIGHLIGHTED_ELEMENTS.includes(item.type.toLowerCase()) && curHighlighted !== item.type) {
        const title = convertContentToRawText(item.children, ' ')
        if (title.trim() !== '')
          outline.push({
            type: item.type,
            title: title,
            id: item.id,
            level: lastLevel
          })
        curHighlighted = item.type
      } else curHighlighted = ''
    }
  })
  return outline
}

interface AnalyseContentProps {
  content: NodeEditorContent
  nodeid: string
}

function analyseContent({ content, nodeid }: AnalyseContentProps): NodeAnalysis {
  if (!content)
    return {
      nodeid,
      outline: [],
      tags: [],
      editorTodos: []
    }
  // console.log('Analuse', content)
  return {
    nodeid,
    outline: getOutline(content),
    tags: getTagsFromContent(content),
    editorTodos: getTodosFromContent(content)
  }
}

expose({ analyseContent })
