import { NodeAnalysis, OutlineItem } from '../../store/useAnalysis'
import { NodeEditorContent } from '../../types/Types'
import { convertContentToRawText, getTitleFromContent } from '../../utils/search/parseData'
import { expose } from 'threads/worker'
import { getTagsFromContent, getTodosFromContent } from '../../utils/lib/content'
import { ELEMENTS_IN_OUTLINE, HIGHLIGHTED_ELEMENTS, LIST_ELEMENTS } from '../../data/outline'
import { AnalyseContentProps } from './controller'
// import { parentPort, workerData } from 'worker_threads'
// parentPort.postMessage(analyseData(workerData.content))
//
const getSingle = (content: NodeEditorContent) => {
  if (content[0] && content[0].children.length === 1) {
    return content[0].children
  } else return getSingle(content[0].children)
}

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
          const title = convertContentToRawText(getSingle(item.children), ' ')
          if (title.trim() !== '')
            outline.push({
              type: item.type,
              title: title,
              id: item.id,
              level: lastLevel
            })
        }
        curHighlighted = ''
      } else if (HIGHLIGHTED_ELEMENTS.includes(item.type.toLowerCase())) {
        if (curHighlighted !== item.type) {
          const title = convertContentToRawText(item.children, ' ')
          if (title.trim() !== '')
            outline.push({
              type: item.type,
              title: title,
              id: item.id,
              level: lastLevel
            })
        }
        curHighlighted = item.type
      } else curHighlighted = ''
    }
  })
  return outline
}

function analyseContent({ content, nodeid, options }: AnalyseContentProps): NodeAnalysis {
  if (!content)
    return {
      nodeid,
      outline: [],
      tags: [],
      editorTodos: []
    }

  const analysisResult = {
    nodeid,
    outline: getOutline(content),
    tags: getTagsFromContent(content),
    editorTodos: getTodosFromContent(content)
  }

  return options.title ? { ...analysisResult, title: getTitleFromContent(content) } : analysisResult
}

expose({ analyseContent })
