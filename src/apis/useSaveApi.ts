import { generateNamespaceId } from '@data/Defaults/idPrefixes'
import { hierarchyParser } from '@hooks/useHierarchy'
import { useLastOpened } from '@hooks/useLastOpened'
import { useNodes } from '@hooks/useNodes'
import { useSearch } from '@hooks/useSearch'
import { View } from '@hooks/useTaskViews'
import { useUpdater } from '@hooks/useUpdater'
import useDataStore from '@store/useDataStore'
import { useSnippetStore } from '@store/useSnippetStore'
import { iLinksToUpdate } from '@utils/hierarchy'
import { runBatch } from '@utils/lib/batchPromise'
import { getTagsFromContent } from '@utils/lib/content'
import toast from 'react-hot-toast'

import { client } from '@workduck-io/dwindle'
import { allNamespacesHierarchyParser } from '@workduck-io/mex-utils'

import { defaultContent } from '../data/Defaults/baseData'
import { DEFAULT_NAMESPACE, WORKSPACE_HEADER } from '../data/Defaults/defaults'
import { USE_API } from '../data/Defaults/dev_'
import { useLinks } from '../hooks/useLinks'
import '../services/apiClient/apiClient'
import { useAuthStore } from '../services/auth/useAuth'
import { isRequestedWithin } from '../store/useApiStore'
import { useContentStore } from '../store/useContentStore'
import { ILink, MIcon, NodeEditorContent } from '../types/Types'
import { mog } from '../utils/lib/helper'
import { extractMetadata } from '../utils/lib/metadata'
import { deserializeContent, serializeContent } from '../utils/lib/serialize'
import { apiURLs } from './routes'

const API_CACHE_LOG = `\nAPI has been requested before, cancelling.\n`

export const useApi = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //
  const { updateDocument, removeDocument } = useSearch()
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const getMetadata = useContentStore((store) => store.getMetadata)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  const { getTitleFromNoteId, updateILinks } = useLinks()
  const { getSharedNode } = useNodes()
  const { addLastOpened } = useLastOpened()
  const addInArchive = useDataStore((store) => store.addInArchive)
  const setILinks = useDataStore((store) => store.setIlinks)
  const setNamespaces = useDataStore((s) => s.setNamespaces)
  const initSnippets = useSnippetStore((store) => store.initSnippets)
  const updateSnippet = useSnippetStore((store) => store.updateSnippet)
  const { updateFromContent } = useUpdater()

  const workspaceHeaders = () => ({
    [WORKSPACE_HEADER]: getWorkspaceId(),
    Accept: 'application/json, text/plain, */*'
  })

  const viewHeaders = () => ({
    ...workspaceHeaders(),
    'mex-api-ver': 'v2'
  })

  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */

  const saveNewNodeAPI = async (
    noteId: string,
    namespace: string,
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
      namespaceID: namespace,
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
        const metadata = extractMetadata(d.data)
        updateFromContent(noteId, d.data.data ?? options.content, metadata)
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
    namespace: string,
    options: {
      path: string
      content: NodeEditorContent
    }
  ) => {
    const reqData = {
      nodePath: {
        path: options.path,
        namespaceID: namespace
      },
      title: getTitleFromNoteId(noteId),
      namespaceID: namespace,
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
        // mog('bulkSaveNodes', d)
        const { changedPaths, node } = d.data
        const addedILinks = []
        const removedILinks = []
        changedPaths.forEach((nsObject) => {
          Object.entries(nsObject).forEach(([nsId, addedRemovedPathObj]: any) => {
            const nsAddedILinks = hierarchyParser(addedRemovedPathObj.addedPaths, nsId)
            const nsRemovedILinks = hierarchyParser(addedRemovedPathObj.removedPaths, nsId)

            addedILinks.push(...nsAddedILinks)
            removedILinks.push(...nsRemovedILinks)
          })
        })
        updateILinks(addedILinks, removedILinks)
        setMetadata(noteId, extractMetadata(node))

        // * set the new hierarchy in the tree
        addLastOpened(noteId)

        return d.data
      })

    return data
  }

  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */
  const saveDataAPI = async (
    nodeid: string,
    namespace: string,
    content: any[],
    isShared = false,
    title?: string,
    templateID?: string
  ) => {
    const reqData = {
      id: nodeid,
      type: 'NodeRequest',
      title: title || getTitleFromNoteId(nodeid),
      namespaceID: namespace,
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
      // Do not send namespace for shared note
      reqData['namespaceID'] = undefined
      reqData['type'] = 'UpdateSharedNodeRequest'
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
    existingNodePath: { path: string; namespaceID?: string },
    newNodePath: { path: string; namespaceID?: string },
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
      .get(apiURLs.namespaces.getHierarchy, {
        headers: workspaceHeaders()
      })
      .then(async (d) => {
        if (d.data) {
          const hierarchy = d.data.hierarchy || {}
          const nodesMetadata = d.data.nodesMetadata || {}

          const parsedHierarchies = allNamespacesHierarchyParser(hierarchy)

          // We create the list of nodes with their respective namespaces
          // And the details of the namespaces from parsed data
          const { nodes, namespaces } = Object.entries(parsedHierarchies).reduce(
            (p, [namespaceid, namespaceData]) => {
              return {
                namespaces: [
                  ...p.namespaces,
                  {
                    id: namespaceid,
                    name: namespaceData.name
                  }
                ],
                nodes: [
                  ...p.nodes,
                  ...namespaceData.nodeHierarchy.map((ilink) => ({
                    ...ilink,
                    namespace: namespaceid,
                    createdAt: nodesMetadata[ilink.nodeid]?.createdAt || Infinity,
                    updatedAt: nodesMetadata[ilink.nodeid]?.updatedAt || Infinity
                  }))
                ]
              }
            },
            { nodes: [], namespaces: [] }
          )

          if (nodes && nodes.length > 0) {
            const localILinks = useDataStore.getState().ilinks
            const { toUpdateLocal } = iLinksToUpdate(localILinks, nodes)

            await runBatch(toUpdateLocal.map((ilink) => getDataAPI(ilink.nodeid)))
            // ipcRenderer.send(IpcAction.UPDATE_ILINKS, { ilinks: nodes }) // * Synced
          }

          // setNamespaces(namespaces)
          setILinks(nodes)

          // mog('Name the spaces', { namespaces, nodes })

          return nodes
        }
      })
      .catch((e) => {
        mog('Error fetching namespaces', { e })
        return []
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

        return newSnippets
      })
      .then(async (newSnippets) => {
        mog('Snippets', { newSnippets })
        const requests = newSnippets?.map(async (item) =>
          getSnippetById(item.snippetID).then(async (snippet) => {
            if (snippet) {
              updateSnippet(snippet.id, snippet)
              const tags = snippet.template ? ['template'] : ['snippet']
              const idxName = snippet.template ? 'template' : 'snippet'
              mog('Update snippet', { snippet, tags })

              if (snippet.template) {
                await removeDocument('snippet', snippet.id)
              } else {
                await removeDocument('template', snippet.id)
              }

              await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)
            }
          })
        )

        if (requests?.length > 0) {
          runBatch(requests).catch((err) => {
            mog('Failed to fetch snippets', { err })
          })
        }
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

  const saveView = async (view: View) => {
    // POST https://http-test.workduck.io/task/view

    const reqData = {
      workspaceId: getWorkspaceId(),

      // nodeId: string;
      properties: {
        title: view.title,
        description: view.description,
        globalJoin: view.globalJoin
      },
      entityId: view.id,
      filters: view.filters
    }

    const resp = await client.post(apiURLs.view.saveView, reqData, { headers: viewHeaders() }).then((resp) => {
      mog('We saved that view', { resp })
      return resp.data
    })

    return resp
  }

  /**
   * Returns undefined when request is not made
   */
  const getAllViews = async (): Promise<View[] | undefined> => {
    const url = apiURLs.view.getAllViews

    if (isRequestedWithin(5, url)) {
      console.log(API_CACHE_LOG)
      return
    }

    const resp = await client.get(url, { headers: viewHeaders() }).then((resp) => {
      // mog('We fetched them view', { resp })
      const views = resp.data
        .map((item: any) => {
          // const itemCreated = new Date(item.created)
          // const isExpired = itemCreated.getTime() - new Date(TaskViewExpiryTime).getTime() < 0
          // mog('itemCreated', { item, itemCreated, isExpired })
          // if (isExpired) {
          //   return undefined
          // }
          return item.entity === 'view'
            ? ({
                title: item.properties.title,
                description: item.properties.description,
                filters: item.filters,
                id: item.entityId,
                globalJoin: item.properties.globalJoin ?? 'all'
              } as View)
            : undefined
        })
        .filter((v: undefined | View) => !!v)
      return views
    })

    return resp
  }

  const deleteView = async (viewid: string) => {
    const resp = await client.delete(apiURLs.view.deleteView(viewid), { headers: viewHeaders() }).then((resp) => {
      mog('We saved that view', { resp })
      return resp.data
    })

    return resp
  }

  const getAllNamespaces = async () => {
    const namespaces = await client
      .get(apiURLs.namespaces.getAll, {
        headers: workspaceHeaders()
      })
      .then((d) => {
        mog('namespaces all', d.data)
        return d.data.map((item: any) => ({
          ns: {
            id: item.id,
            name: item.name,
            icon: item.namespaceMetadata?.icon ?? undefined,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          },
          archiveHierarchy: item.archivedNodeHierarchyInformation
        }))
      })
      .catch((e) => {
        mog('Save error', e)
        return undefined
      })

    if (namespaces) {
      setNamespaces(namespaces.map((n) => n.ns))
      namespaces.map((n) => {
        const archivedNotes = hierarchyParser(n.archiveHierarchy, n.ns.id, {
          withParentNodeId: true,
          allowDuplicates: true
        })

        if (archivedNotes && archivedNotes.length > 0) {
          const localILinks = useDataStore.getState().archive
          const { toUpdateLocal } = iLinksToUpdate(localILinks, archivedNotes)

          mog('toUpdateLocal', { n, toUpdateLocal, archivedNotes })

          runBatch(
            toUpdateLocal.map((ilink) =>
              getDataAPI(ilink.nodeid, false, false, false).then((data) => {
                mog('toUpdateLocal', { ilink, data })
                setContent(ilink.nodeid, data.content, data.metadata)
                updateDocument('archive', ilink.nodeid, data.content)
              })
            )
          ).then(() => {
            addInArchive(archivedNotes)
          })
        }
      })
    }
  }

  const createNewNamespace = async (name: string) => {
    try {
      const res = await client
        .post(
          apiURLs.namespaces.create,
          {
            type: 'NamespaceRequest',
            name,
            id: generateNamespaceId(),
            metadata: {
              iconUrl: 'heroicons-outline:view-grid'
            }
          },
          {
            headers: workspaceHeaders()
          }
        )
        .then((d) => ({
          id: d?.data?.id,
          name: d?.data?.name,
          iconUrl: d?.data?.metadata?.iconUrl,
          createdAt: d?.data?.createdAt,
          updatedAt: d?.data?.updatedAt
        }))

      mog('We created a namespace', { res })

      return res
    } catch (err) {
      toast('Unable to Create New Namespace')
    }
  }

  const changeNamespaceName = async (id: string, name: string) => {
    try {
      const res = await client
        .patch(
          apiURLs.namespaces.update,
          {
            type: 'NamespaceRequest',
            id,
            name
          },
          {
            headers: workspaceHeaders()
          }
        )
        .then(() => true)
      return res
    } catch (err) {
      throw new Error('Unable to update namespace')
    }
  }

  const changeNamespaceIcon = async (id: string, name: string, icon: MIcon) => {
    try {
      const res = await client
        .patch(
          apiURLs.namespaces.update,
          {
            type: 'NamespaceRequest',
            id,
            name,
            metadata: {
              icon
            }
          },
          {
            headers: workspaceHeaders()
          }
        )
        .then(() => icon)
      return res
    } catch (err) {
      throw new Error('Unable to update namespace icon')
    }
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
    getAllViews,
    getAllNamespaces,
    changeNamespaceName,
    changeNamespaceIcon,
    createNewNamespace
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
