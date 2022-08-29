import { client } from '@workduck-io/dwindle'
import { defaultContent } from '../data/Defaults/baseData'
import { USE_API } from '../data/Defaults/dev_'
import '../services/apiClient/apiClient'
import { useAuthStore } from '../services/auth/useAuth'
import { isRequestedWithin } from '../store/useApiStore'
import { useContentStore } from '../store/useContentStore'
import { mog } from '../utils/lib/helper'
import { extractMetadata } from '../utils/lib/metadata'
import { deserializeContent, serializeContent } from '../utils/lib/serialize'
import { apiURLs } from './routes'
import { WORKSPACE_HEADER, DEFAULT_NAMESPACE } from '../data/Defaults/defaults'
import { useLinks } from '../hooks/useLinks'
import { useNodes } from '@hooks/useNodes'
import { ILink, NodeEditorContent } from '../types/Types'
import { hierarchyParser } from '@hooks/useHierarchy'
import { getTagsFromContent } from '@utils/lib/content'
import useDataStore from '@store/useDataStore'
import { iLinksToUpdate } from '@utils/hierarchy'
import { runBatch } from '@utils/lib/batchPromise'
import { useUpdater } from '@hooks/useUpdater'
import { useSnippetStore } from '@store/useSnippetStore'
import toast from 'react-hot-toast'
import { useLastOpened } from '@hooks/useLastOpened'
import { View } from '@hooks/useTaskViews'

const API_CACHE_LOG = `\nAPI has been requested before, cancelling.\n`

export const useApi = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const getMetadata = useContentStore((store) => store.getMetadata)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  const { getTitleFromNoteId, updateILinks } = useLinks()
  const { getSharedNode } = useNodes()
  const { addLastOpened } = useLastOpened()
  const setILinks = useDataStore((store) => store.setIlinks)
  const initSnippets = useSnippetStore((store) => store.initSnippets)

  const { updateFromContent } = useUpdater()

  const workspaceHeaders = () => ({
    [WORKSPACE_HEADER]: getWorkspaceId(),
    Accept: 'application/json, text/plain, */*'
  })

  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */

  const saveNewNodeAPI = async (
    noteId: string,
    options?: {
      path: string
      parentNoteId: string
      content: NodeEditorContent
    }
  ) => {
    const reqData = {
      id: noteId,
      title: getTitleFromNoteId(noteId),
      referenceID: options?.parentNoteId,
      namespaceIdentifier: DEFAULT_NAMESPACE,
      type: 'NodeRequest',
      tags: getTagsFromContent(options.content),
      data: serializeContent(options.content, noteId)
    }

    setContent(noteId, options.content)

    if (!USE_API) {
      return
    }

    const data = await client
      .post(apiURLs.saveNode, reqData, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        const { addedPaths, removedPaths, node } = d.data
        const addedILinks = hierarchyParser(addedPaths)
        const removedILinks = hierarchyParser(removedPaths)
        setMetadata(noteId, extractMetadata(node))

        // * set the new hierarchy in the tree
        updateILinks(addedILinks, removedILinks)

        setMetadata(noteId, extractMetadata(d.data))
        addLastOpened(noteId)
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })

    return data
  }

  const bulkSaveNodes = async (
    noteId: string,
    options: {
      path: string
      content: NodeEditorContent
    }
  ) => {
    const reqData = {
      nodePath: {
        path: options.path
      },
      title: getTitleFromNoteId(noteId),
      namespaceIdentifier: DEFAULT_NAMESPACE,
      type: 'NodeBulkRequest',
      tags: getTagsFromContent(options.content),
      data: serializeContent(options.content, noteId)
    }

    setContent(noteId, options.content)

    const data = await client
      .post(apiURLs.bulkSaveNodes, reqData, {
        headers: workspaceHeaders()
      })
      .then((d: any) => {
        const { addedPaths, removedPaths, node } = d.data
        const addedILinks = hierarchyParser(addedPaths)
        const removedILinks = hierarchyParser(removedPaths)
        setMetadata(noteId, extractMetadata(node))

        // * set the new hierarchy in the tree
        updateILinks(addedILinks, removedILinks)
        addLastOpened(noteId)

        return d.data
      })

    return data
  }

  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */
  const saveDataAPI = async (nodeid: string, content: any[], isShared = false, title?: string, templateID?: string) => {
    const reqData = {
      id: nodeid,
      type: 'NodeRequest',
      title: title || getTitleFromNoteId(nodeid),
      namespaceIdentifier: DEFAULT_NAMESPACE,
      tags: getTagsFromContent(content),
      data: serializeContent(content ?? defaultContent.content, nodeid),
      // Because we have to send templateID with every node save call so that it doesn't get unset
      // We are checking if the id is __null__ for the case when the user wants to remove the template
      // If not, we send what was passed as prop, if nothing then from metadata
      metadata: { templateID: templateID === '__null__' ? null : templateID ?? getMetadata(nodeid)?.templateID }
    }

    if (isShared) {
      const node = getSharedNode(nodeid)
      if (node.currentUserAccess[nodeid] === 'READ') return
    }

    if (!USE_API) {
      return
    }
    const url = isShared ? apiURLs.updateSharedNode : apiURLs.saveNode
    const data = await client
      .post(url, reqData, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        mog('savedData', { d })
        setMetadata(nodeid, extractMetadata(d.data))
        addLastOpened(nodeid)
        // setContent(nodeid, deserializeContent(d.data.data), extractMetadata(d.data))
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }

  const makeNotePublic = async (nodeId: string) => {
    const URL = apiURLs.makeNotePublic(nodeId)
    return await client
      .patch(URL, null, {
        withCredentials: false,
        headers: {
          'mex-workspace-id': getWorkspaceId(),
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((resp) => resp.data)
      .then((data: any) => {
        setMetadata(nodeId, { publicAccess: true })
        return nodeId
      })
      .catch((error) => {
        mog('MakeNodePublicError', { error })
      })
  }

  const makeNotePrivate = async (nodeId: string) => {
    const URL = apiURLs.makeNotePrivate(nodeId)

    return await client
      .patch(URL, null, {
        withCredentials: false,
        headers: {
          'mex-workspace-id': getWorkspaceId()
        }
      })
      .then((resp) => resp.data)
      .then((data: any) => {
        setMetadata(nodeId, { publicAccess: false })
        return nodeId
      })
      .catch((error) => {
        mog('MakeNodePrivateError', { error })
      })
  }

  const refactorNotes = async (
    existingNodePath: { path: string; namespaceId?: string },
    newNodePath: { path: string; namespaceId?: string },
    nodeId: string
  ) => {
    const reqData = {
      existingNodePath,
      newNodePath,
      nodeID: nodeId,
      type: 'RefactorRequest'
    }

    const data = await client
      .post(apiURLs.refactor, reqData, {
        headers: workspaceHeaders()
      })
      .then((response) => {
        mog('refactor', response.data)
        return response.data
      })
      .catch((error) => {
        console.log(error)
      })

    return data
  }

  const getPublicNoteApi = async (noteId: string) => {
    const res = await client
      .get(apiURLs.getPublicNote(noteId), {
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      })
      .then((d: any) => {
        // console.log(metadata, d.data)
        return {
          title: d.data.title,
          data: d.data.data,
          metadata: extractMetadata(d.data),
          version: d.data.version ?? undefined
        }
      })

    if (res) {
      return {
        id: noteId,
        title: res.title ?? '',
        content: deserializeContent(res.data),
        metadata: res.metadata ?? undefined,
        version: res.version
      }
    }
  }

  const getPublicURL = (nodeid: string) => {
    const meta = useContentStore.getState().getAllMetadata()
    mog('META', { m: meta?.[nodeid] })
    if (meta?.[nodeid]?.publicAccess) return apiURLs.getNotePublicURL(nodeid)
  }

  const getDataAPI = async (nodeid: string, isShared = false, isRefresh = false, isUpdate = true) => {
    const url = isShared ? apiURLs.getSharedNode(nodeid) : apiURLs.getNode(nodeid)
    if (!isShared && isRequestedWithin(2, url) && !isRefresh) {
      console.log(API_CACHE_LOG)
      return
    }

    // console.warn('\n\n\n\nAPI has not been requested before, requesting\n\n\n\n')
    const res = await client
      .get(url, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        // console.log(metadata, d.data)
        const content = deserializeContent(d.data.data)
        const metadata = extractMetadata(d.data)

        if (isUpdate) updateFromContent(nodeid, content, metadata)

        return { content, metadata, version: d.data.version ?? undefined }
      })
      .catch((e) => {
        console.error(`MexError: Fetching nodeid ${nodeid} failed with: `, e)
      })

    if (res) {
      return { content: res?.content, metadata: res?.metadata ?? undefined, version: res.version }
    }
  }

  const getNodesByWorkspace = async (): Promise<ILink[]> => {
    const data = await client
      .get(apiURLs.getHierarchy(), {
        headers: workspaceHeaders()
      })
      .then((d) => {
        if (d.data) {
          const hierarchy = d.data.hierarchy || []
          const nodesMetadata = d.data.nodesMetadata || {}
          const nodes = hierarchyParser(hierarchy).map((ilink) => ({
            ...ilink,
            createdAt: nodesMetadata[ilink.nodeid]?.createdAt || Infinity,
            updatedAt: nodesMetadata[ilink.nodeid]?.updatedAt || Infinity
          }))

          if (nodes && nodes.length > 0) {
            const localILinks = useDataStore.getState().ilinks
            const { toUpdateLocal } = iLinksToUpdate(localILinks, nodes)

            runBatch(toUpdateLocal.map((ilink) => getDataAPI(ilink.nodeid)))

            // ipcRenderer.send(IpcAction.UPDATE_ILINKS, { ilinks: nodes }) // * Synced
          }

          setILinks(nodes)

          return nodes
        }
      })

    return data
  }

  const getGoogleAuthUrl = async () => {
    return await client
      .get<any>(apiURLs.getGoogleAuthUrl(), {})
      .then((resp) => resp.data)
      .catch((error) => console.error(error))
  }

  const saveSnippetAPI = async ({
    snippetId,
    snippetTitle,
    content,
    template
  }: {
    snippetId: string
    snippetTitle: string
    content: any[]
    template?: boolean
  }) => {
    const reqData = {
      id: snippetId,
      type: 'SnippetRequest',
      title: snippetTitle,
      namespaceIdentifier: DEFAULT_NAMESPACE,
      data: serializeContent(content ?? defaultContent.content, snippetId),
      template: template ?? false
    }

    const data = await client
      .post(apiURLs.createSnippet, reqData, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        mog('savedData', { d })
        setMetadata(snippetId, extractMetadata(d.data))
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }

  const getAllSnippetsByWorkspace = async () => {
    const data = await client
      .get(apiURLs.getAllSnippetsByWorkspace, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        return d.data
      })
      .then((d) => {
        const snippets = useSnippetStore.getState().snippets
        const newSnippets = d.filter((snippet) => {
          const existSnippet = snippets.find((s) => s.id === snippet.snippetID)
          return existSnippet === undefined
        })
        mog('newSnippets', { newSnippets, snippets })
        initSnippets([
          ...snippets,
          ...newSnippets.map((item) => ({
            icon: 'ri:quill-pen-line',
            id: item.snippetID,
            template: item.template,
            title: item.title,
            content: []
          }))
        ])
      })

    return data
  }

  const deleteSnippetById = async (id: string) => {
    const url = apiURLs.deleteSnippetById(id)
    try {
      const res = await client.delete(url, {
        headers: workspaceHeaders()
      })

      return { status: true }
    } catch (err) {
      toast('Unable to delete Snippet')
    }
  }

  const getSnippetById = async (id: string) => {
    const url = apiURLs.getSnippetById(id)

    const data = await client
      .get(url, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        mog('snippet by id', { d })
        return d.data
      })

    return data
  }

  const saveView = async (view: View<any>) => {
    // POST https://http-test.workduck.io/task/view

    const reqData = {
      workspaceId: getWorkspaceId(),

      // nodeId: string;
      properties: {
        title: view.title,
        description: view.description
      },
      entityId: view.id,
      filters: view.filters
    }

    const resp = await client.post(apiURLs.view.saveView, reqData, { headers: workspaceHeaders() }).then((resp) => {
      mog('We saved that view', { resp })
      return resp.data
    })

    return resp
  }

  /**
   * Returns undefined when request is not made
   */
  const getAllViews = async (): Promise<View<any>[] | undefined> => {
    const url = apiURLs.view.getAllViews

    if (isRequestedWithin(5, url)) {
      console.log(API_CACHE_LOG)
      return
    }

    const resp = await client.get(url, { headers: workspaceHeaders() }).then((resp) => {
      // mog('We fetched them view', { resp })
      const views = resp.data
        .map((item: any) => {
          return item.entity === 'view'
            ? ({
                title: item.properties.title,
                description: item.properties.description,
                filters: item.filters,
                id: item.entityId
              } as View<any>)
            : undefined
        })
        .filter((v: undefined | View<any>) => !!v)
      return views
    })

    return resp
  }

  const deleteView = async (viewid: string) => {
    const resp = await client.delete(apiURLs.view.deleteView(viewid), { headers: workspaceHeaders() }).then((resp) => {
      mog('We saved that view', { resp })
      return resp.data
    })

    return resp
  }

  return {
    saveDataAPI,
    getDataAPI,
    refactorNotes,
    makeNotePrivate,
    saveSnippetAPI,
    deleteSnippetById,
    getAllSnippetsByWorkspace,
    getSnippetById,
    makeNotePublic,
    getPublicNoteApi,
    getPublicURL,
    bulkSaveNodes,
    saveNewNodeAPI,
    getNodesByWorkspace,
    getGoogleAuthUrl,
    saveView,
    deleteView,
    getAllViews
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const testPerfFunc = (func: () => any, num = 100) => {
  const ar = Array.from(Array(num).keys())
  const t0 = performance.now()
  const res = ar.map(() => func())
  const t1 = performance.now()
  console.log('Performance: ', {
    time: t1 - t0,
    t1,
    t0,
    avg: (t1 - t0) / ar.length,
    res: { res }
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const testPerf = async (nodeid: string) => {
//   const ar = Array.from(Array(100).keys())
//   const t0 = performance.now()
//   let lost = 0
//   await Promise.all(
//     ar.map(async () => {
//       await API.get('mex', `/node/${nodeid}`, {}).catch(() => {
//         lost++
//       })
//     })
//   )
//   const t1 = performance.now()
//   console.info('Parallel Performance', {
//     time: t1 - t0,
//     t1,
//     t0,
//     lost,
//     avg: (t1 - t0) / ar.length
//   })

//   const t01 = performance.now()
//   lost = 0
//   await ar
//     .reduce(async (seq) => {
//       return seq
//         .then(async () => {
//           await API.get('mex', `/node/${nodeid}`, {})
//         })
//         .catch(() => {
//           lost++
//         })
//     }, Promise.resolve())
//     .then(() => console.info('Finished'))

//   const t11 = performance.now()
//   console.info('Linear Performance', {
//     time: t11 - t01,
//     t11,
//     t01,
//     lost,
//     avg: (t11 - t01) / (ar.length - lost)
//   })
// }
