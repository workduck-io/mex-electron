import { NodeAnalysis } from '../../store/useAnalysis'
import { NodeEditorContent } from '../../types/Types'
import { expose } from 'threads/worker'
import { getElementsFromContent } from '../../utils/lib/content'

function analyseContent(content: NodeEditorContent): NodeAnalysis {
  if (!content)
    return {
      outline: [],
      tags: []
    }

  const analysis = getElementsFromContent(content)
  return analysis
}

expose({ analyseContent })
