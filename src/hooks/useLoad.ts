import { ILink, NodeEditorContent } from '../types/Types'
import { NodeProperties, useEditorStore } from '@store/useEditorStore'
import { mog, updateEmptyBlockTypes } from '@utils/lib/helper'

import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph'
import { USE_API } from '@data/Defaults/dev_'
import { getContent } from '@utils/helpers'
import toast from 'react-hot-toast'
import { useApi } from '@apis/useSaveApi'
import { useContentStore } from '@store/useContentStore'
import useDataStore from '@store/useDataStore'
import { useEditorBuffer } from './useEditorBuffer'
import { useGraphStore } from '@store/useGraphStore'
import useSuggestionStore from '@store/useSuggestionStore'
import useToggleElements from './useToggleElements'
import { useLayoutStore } from '@store/useLayoutStore'
import { useRefactor } from './useRefactor'
import { getAllParentIds, getParentId, SEPARATOR } from '@components/mex/Sidebar/treeUtils'
import { useAnalysisStore } from '@store/useAnalysis'
import { checkIfUntitledDraftNode } from '@utils/lib/strings'
import { getPathFromNodeIdHookless } from './useLinks'
import { DRAFT_PREFIX } from '@data/Defaults/idPrefixes'
import { useBlockHighlightStore } from '@editor/Actions/useFocusBlock'
import { useTreeStore } from '@store/useTreeStore'

export interface LoadNodeOptions {
  savePrev?: boolean
  fetch?: boolean
  node?: NodeProperties
  withLoading?: boolean
  // Highlights the block after loading
  highlightBlockId?: string
}

export interface IsLocalType {
  isLocal: boolean
  ilink?: ILink
  isShared: boolean
}

export type LoadNodeFn = (nodeid: string, options?: LoadNodeOptions) => void

const useLoad = () => {
  const loadNodeEditor = useEditorStore((store) => store.loadNode)
  const loadNodeAndReplaceContent = useEditorStore((store) => store.loadNodeAndReplaceContent)
  const setFetchingContent = useEditorStore((store) => store.setFetchingContent)
  const setContent = useContentStore((store) => store.setContent)
  const setNodePreview = useGraphStore((store) => store.setNodePreview)
  const setSelectedNode = useGraphStore((store) => store.setSelectedNode)
  const { getDataAPI, saveDataAPI } = useApi()
  const setSuggestions = useSuggestionStore((store) => store.setSuggestions)
  const { toggleSuggestedNodes } = useToggleElements()
  const infobar = useLayoutStore((store) => store.infobar)
  const setHighlights = useBlockHighlightStore((store) => store.setHighlightedBlockIds)

  const setLoadingNodeid = useEditorStore((store) => store.setLoadingNodeid)
  // const { push } = useNavigation()
  // const clearLoadingNodeid = useEditorStore((store) => store.clearLoadingNodeid)
  const expandNodes = useTreeStore((store) => store.expandNodes)

  // const { saveNodeAPIandFs } = useDataSaverFromContent()
  const { saveAndClearBuffer } = useEditorBuffer()
  const { execRefactor } = useRefactor()
  // const { saveQ } = useSaveQ()

  const saveNodeName = (nodeId: string, title?: string) => {
    const draftNodeTitle = title ?? useAnalysisStore.getState().analysis.title
    mog('SAVE NODE NAME', { draftNodeTitle })
    if (!draftNodeTitle) return

    const nodePath = getPathFromNodeIdHookless(nodeId)
    const isUntitled = checkIfUntitledDraftNode(nodePath)

    if (!isUntitled) return

    const parentNodePath = getParentId(nodePath)
    const newNodePath = `${parentNodePath}.${draftNodeTitle}`

    if (newNodePath !== nodePath)
      try {
        execRefactor(nodePath, newNodePath, false)
        loadNode(nodeId, { fetch: false })
      } catch (err) {
        toast('Unable to rename node')
      }
  }

  const getNode = (nodeid: string): NodeProperties => {
    const ilinks = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive
    const sharedNodes = useDataStore.getState().sharedNodes

    const archiveLink = archive.find((i) => i.nodeid === nodeid)
    const respectiveLink = ilinks.find((i) => i.nodeid === nodeid)
    const sharedLink = sharedNodes.find((i) => i.nodeid === nodeid)

    const UID = respectiveLink?.nodeid ?? archiveLink?.nodeid ?? sharedLink?.nodeid ?? nodeid
    const text = respectiveLink?.path ?? archiveLink?.path ?? sharedLink?.path

    const node = {
      title: text,
      id: text,
      nodeid: UID,
      path: text
    }

    return node
  }

  const isLocalNode = (nodeid: string): IsLocalType => {
    const ilinks = useDataStore.getState().ilinks
    const archive = useDataStore.getState().archive
    const sharedNodes = useDataStore.getState().sharedNodes

    const node = getNode(nodeid)

    const inIlinks = ilinks.find((i) => i.nodeid === nodeid)
    const inArchive = archive.find((i) => i.nodeid === nodeid)
    const inShared = sharedNodes.find((i) => i.nodeid === nodeid)

    const isDraftNode = node && node.path?.startsWith(`${DRAFT_PREFIX}${SEPARATOR}`)

    // const isSharedNode =

    const res = {
      isLocal: !!inIlinks || !!inArchive || !!isDraftNode,
      isShared: !!inShared,
      ilink: inIlinks ?? inArchive
    }

    return res

    // return inIlinks || inArchive || isDraftNode
  }

  /*
   * Saves content of a node to api and then uses
   * the response to update the content from server in local state
   */
  const saveApiAndUpdate = (node: NodeProperties, content: NodeEditorContent) => {
    const sharedNodes = useDataStore.getState().sharedNodes
    const isShared = !!sharedNodes.find((i) => i.nodeid === node.nodeid)
    setFetchingContent(true)
    saveDataAPI(node.nodeid, content, isShared)
      .then((data) => {
        if (data) {
          // const { data, metadata, version } = res
          // goTo(ROUTE_PATHS.node, NavigationType.replace, node.nodeid)
          // mog('SAVED DATA', { data })
          // if (data) {
          //   updateEmptyBlockTypes(data, ELEMENT_PARAGRAPH)
          //   const nodeContent = {
          //     type: 'editor',
          //     content: data,
          //     version,
          //     metadata
          //   }
          // loadNodeAndReplaceContent(node, nodeContent)
          //   setContent(node.nodeid, data, metadata)
          // setFetchingContent(false)
          // }
        }
      })
      .catch(console.error)
      .finally(() => setFetchingContent(false))
  }

  /*
   * Fetches the node and saves it to local state
   * Should be used when current editor content is irrelevant to the node
   */
  const fetchAndSaveNode = async (node: NodeProperties, options = { withLoading: true, isShared: false }) => {
    // console.log('Fetch and save', { node })
    // const node = getNode(nodeid)
    if (options.withLoading) setFetchingContent(true)
    getDataAPI(node.nodeid, options.isShared)
      .then((nodeData) => {
        if (nodeData) {
          // console.log(res)
          const { content, metadata, version } = nodeData

          if (content) {
            updateEmptyBlockTypes(content, ELEMENT_PARAGRAPH)
            const nodeContent = {
              type: 'editor',
              content,
              version,
              metadata
            }

            // mog('Fetch and load data', { data, metadata, version })
            const loadingNodeid = useEditorStore.getState().loadingNodeid

            if (node.nodeid === loadingNodeid) {
              loadNodeAndReplaceContent(node, nodeContent)
            } else {
              mog('CurrentNode is not same for loadNode', { node, loadingNodeid })
            }
            setContent(node.nodeid, content, metadata)
          }
        }
        if (options.withLoading) setFetchingContent(false)
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        if (options.withLoading) setFetchingContent(false)
      })
  }

  // const saveDebouncedAPIfs = () => {
  // const oldNode = useEditorStore.getState().node
  // if (oldNode && oldNode.nodeid !== '__null__') saveNodeAPIandFs(oldNode.nodeid)
  // }

  /**
   * Loads a node in the editor.
   * This does not navigate to editor.
   *
   * For shared:
   * fetchAndSave different
   */
  const loadNode: LoadNodeFn = (nodeid, options = { savePrev: true, fetch: USE_API, withLoading: true }) => {
    const hasBeenLoaded = false
    const currentNodeId = useEditorStore.getState().node.nodeid

    const localCheck = isLocalNode(nodeid)

    if (!options.node && !localCheck.isLocal && !localCheck.isShared) {
      toast.error('Selected note does not exist.')
      nodeid = currentNodeId
    }

    setLoadingNodeid(nodeid)

    setNodePreview(false)
    setSuggestions([])
    if (infobar.mode === 'suggestions') toggleSuggestedNodes()

    setSelectedNode(undefined)

    // const q = useQStore.getState().q
    if (options.savePrev) {
      // if (q.includes(nodeid)) {
      //   hasBeenLoaded = true
      // }
      saveNodeName(currentNodeId)
      saveAndClearBuffer()

      // if (q.length > 0) {
      // saveQ()
      // }
    }

    const node = options.node ?? getNode(nodeid)

    mog('LOAD NODE', { nodeid, options, cond: options.fetch && !hasBeenLoaded, hasBeenLoaded })
    if (options.fetch && !hasBeenLoaded) {
      mog('Fetching')
      if (localCheck.isShared) {
        // TODO: Change fetch for shared
        fetchAndSaveNode(node, { withLoading: true, isShared: true })
      } else fetchAndSaveNode(node, { withLoading: true, isShared: false })
    }
    if (options.highlightBlockId) {
      setHighlights([options.highlightBlockId], 'editor')
    }

    if (!localCheck.isShared) {
      const allParents = getAllParentIds(node.path)
      expandNodes(allParents)
    }

    loadNodeEditor(node)
  }

  const loadNodeProps = (nodeProps: NodeProperties) => {
    loadNodeEditor(nodeProps)
  }

  const loadNodeAndAppend = async (nodeid: string, content: NodeEditorContent) => {
    const nodeProps = getNode(nodeid)
    const nodeContent = getContent(nodeid)

    const appendedContent = [...nodeContent.content, ...content]
    mog('Appended content', { appendedContent })

    loadNodeAndReplaceContent(nodeProps, { ...nodeContent, content: appendedContent })
  }

  return {
    loadNode,
    fetchAndSaveNode,
    saveNodeName,
    loadNodeAndAppend,
    isLocalNode,
    loadNodeProps,
    getNode,
    saveApiAndUpdate
  }
}

export default useLoad
