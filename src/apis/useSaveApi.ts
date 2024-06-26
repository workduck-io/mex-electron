import { generateNamespaceId } from '@data/Defaults/idPrefixes'

import { useLastOpened } from '@hooks/useLastOpened'
import { useNodes } from '@hooks/useNodes'
import { useSearch } from '@hooks/useSearch'
import { useUpdater } from '@hooks/useUpdater'
import useDataStore from '@store/useDataStore'
import { useSnippetStore } from '@store/useSnippetStore'
import { iLinksToUpdate } from '@utils/hierarchy'
import { batchArray, batchArrayWithNamespaces, runBatch } from '@utils/lib/batchPromise'
import { getTagsFromContent } from '@utils/lib/content'
import { mog } from '@utils/lib/mog'
import toast from 'react-hot-toast'

import { API } from '../API/Base'
import { defaultContent } from '../data/Defaults/baseData'
import { DEFAULT_NAMESPACE, GET_REQUEST_MINIMUM_GAP_IN_MS, WORKSPACE_HEADER } from '../data/Defaults/defaults'
import { USE_API } from '../data/Defaults/dev_'
import { useLinks } from '../hooks/useLinks'
import { useAuthStore } from '../services/auth/useAuth'
import { useContentStore } from '../store/useContentStore'
import { ILink, MIcon, NodeEditorContent } from '../types/Types'
import { View } from '../types/data'
import { extractMetadata } from '../utils/lib/metadata'
import { deserializeContent, serializeContent } from '../utils/lib/serialize'
import { apiURLs } from './routes'
import { AccessLevel } from '../types/mentions'
import { Reminder } from '../types/reminders'
import { getReminderAssociatedId } from '@hooks/useReminders'
import { APIReaction } from '../types/reaction'
import { APIComment } from '../types/comment'

interface ReactionRequests {
  nodeId: string
  blockId: string
  reaction: MIcon
  action: 'ADD' | 'DELETE'
}


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

  const setILinks = useDataStore((store) => store.setIlinks)
  const setNamespaces = useDataStore((s) => s.setNamespaces)
  const initSnippets = useSnippetStore((store) => store.initSnippets)
  const updateSnippet = useSnippetStore((store) => store.updateSnippet)
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

    const data = await await API.node
      .save(reqData)
      .then((d) => {
        const metadata = extractMetadata(d.data)
        const content = deserializeContent(d.data.data ?? options.content)
        updateFromContent(noteId, content, metadata)
        addLastOpened(noteId)
        return d.data
      })
      .catch((e) => {
        console.error(e)
      })

    return data
  }


  const appendToNode = async (noteId: string, content: NodeEditorContent, options?: { isShared?: boolean }) => {
    const reqData = {
      type: 'ElementRequest',
      elements: serializeContent(content, noteId)
    }

    // * TODO: Add append to Note for shared notes
    const res = await API.node.append(noteId, reqData)

    // const res = await client.patch(url, reqData, { headers: workspaceHeaders() })

    if (res) {
      // toast('Task added!')
    }
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
      id: noteId,
      title: getTitleFromNoteId(noteId),
      namespaceID: namespace,
      type: 'NodeBulkRequest',
      tags: getTagsFromContent(options.content),
      data: serializeContent(options.content, noteId)
    }
    mog('BulkCreateNodes', { reqData, noteId, namespace, options })
    setContent(noteId, options.content)

    const data = await API.node.bulkCreate(reqData).then((d: any) => {
      const addedILinks = []
      const removedILinks = []
      const { changedPaths, node } = d
      Object.entries(changedPaths).forEach(([nsId, changed]: [string, any]) => {
        const { addedPaths: nsAddedILinks, removedPaths: nsRemovedILinks } = changed
        addedILinks.push(...nsAddedILinks)
        removedILinks.push(...nsRemovedILinks)
      })
      updateILinks(addedILinks, removedILinks)
      setMetadata(noteId, extractMetadata(node))
      addLastOpened(noteId)
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
    const dataPromise = isShared ? API.share.updateNode(reqData) : API.node.save(reqData)

    const data = await dataPromise
      .then((d) => {
        setMetadata(nodeid, extractMetadata(d))
        addLastOpened(nodeid)
        // setContent(nodeid, deserializeContent(d.data.data), extractMetadata(d.data))
        return d
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }

  const makeNotePublic = async (nodeId: string) => {
    return await API.node
      .makePublic(nodeId)
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
    return await API.node
      .makePrivate(nodeId)
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

    const data = await API.node.refactor(reqData).catch((error) => {
      console.error(error)
    })

    return data
  }

  const getPublicNoteApi = async (noteId: string) => {
    const res = await API.node
      .getPublic(noteId, {})
      .then((d: any) => {
        // console.log(metadata, d.data)
        return {
          title: d.title,
          data: d.data,
          metadata: extractMetadata(d),
          version: d.version ?? undefined
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
    if (meta?.[nodeid]?.publicAccess) return apiURLs.frontend.getPublicNodePath(nodeid)
  }

  const getDataAPI = async (nodeid: string, isShared = false, isRefresh = false, isUpdate = true) => {
    // const url = isShared ? apiURLs.share.getSharedNode(nodeid) : apiURLs.node.get(nodeid)
    // if (!isShared && isRequestedWithin(2, url) && !isRefresh) {
    //   console.log(API_CACHE_LOG)
    //   return
    // }

    const res = await API.node
      .getById(nodeid, { cache: true, expiry: GET_REQUEST_MINIMUM_GAP_IN_MS })
      .then((d) => {
        // console.log(metadata, d.data)
        const content = d?.data?.length ? deserializeContent(d.data) : defaultContent.content
        const metadata = extractMetadata(d.data)

        if (isUpdate) updateFromContent(nodeid, content, metadata)

        return { content, metadata, version: d.version ?? undefined }
      })
      .catch((e) => {
        console.error(`MexError: Fetching nodeid ${nodeid} failed with: `, e)
      })

    return res
  }

  const getNodesByWorkspace = async (): Promise<ILink[]> => {
    const data = await API.namespace
      .getHeirarchy()
      .then(async (d) => {
        if (d.data) {
          const parsedHierarchies: any = d.data

          // We create the list of nodes with their respective namespaces
          // And the details of the namespaces from parsed data
          const { nodes, namespaces } = Object.entries(parsedHierarchies).reduce(
            (p, [namespaceid, namespaceData]: any) => {
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
                    createdAt: ilink?.createdAt || Infinity,
                    updatedAt: ilink?.updatedAt || Infinity
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
    const resp = API.loch
      .getGoogleAuthUrl()
      .then((resp) => resp.data)
      .catch((error) => console.error(error))
    return resp;
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

    const data = await API.snippet
      .create(reqData)
      .then((d) => {
        mog('savedData', { d })
        setMetadata(snippetId, extractMetadata(d))
        return d
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }

  const bulkGetSnippets = async (ids: string[]) => {
    const url = apiURLs.snippet.bulkGet
    const data = {ids: ids};
    const resp = API.snippet
      .bulkGet(data)
      .then((d: any) => {
      if (d) {
        if (d.failed.length > 0) mog('Failed API Requests: ', { url, ids: d.failed })
        d.successful.forEach(async (snippet) => {
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

        return d.data.successful
      }
    })
  return resp
  }

  const getAllSnippetsByWorkspace = async () => {
    const data = await API.snippet
      .allOfWorkspace()
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
            content: defaultContent.content
          }))
        ])

        return newSnippets
      })
      .then(async (newSnippets) => {
        const toUpdateSnippets = newSnippets?.map((item) => item.snippetID)
        mog('NewSnippets', { newSnippets, toUpdateSnippets })
        if (toUpdateSnippets && toUpdateSnippets.length > 0) {
          const batches = batchArray(toUpdateSnippets, 10)
          const promises = batches.map((ids) => bulkGetSnippets(ids))
          await runBatch(promises)
        }
      })

    return data
  }

  const deleteSnippetById = async (id: string) => {
    // const url = apiURLs.snippet.deleteAllVersionsOfSnippet(id)
    // try {
    //   const res = await client.delete(url, {
    //     headers: workspaceHeaders()
    //   })

    //   return { status: true }
    // } catch (err) {
    //   toast('Unable to delete Snippet')
    // }
    await API.snippet
      .deleteAllVersions(id)
      .then((response) => {
        mog('SnippetDeleteSuccessful')
      })
      .catch((error) => {
        mog('SnippetDeleteFailed', { error })
      })
  }

  const getSnippetById = async (id: string) => {
    const data = await API.snippet.getById(id)
    return data
  }

  const saveView = async (view: View) => {
    // POST https://http-staging.workduck.io/task/view

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

    const resp = await API.view.create(reqData)

    return resp
  }

  /**
   * Returns undefined when request is not made
   */
  const getAllViews = async (): Promise<View[] | undefined> => {
    const resp = await API.view.getAll({ cache: true, expiry: GET_REQUEST_MINIMUM_GAP_IN_MS }).then((resp: any) => {
      if (!resp) return
      // mog('We fetched them view', { resp })
      const views = resp
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
    const resp = await API.view.delete(viewid).then((resp) => {
      mog('We saved that view', { resp })
      return resp
    })

    return resp
  }

  const bulkGetNodes = async (ids: string[], namespaceID?: string, isShared = false) => {
    namespaceID = namespaceID && namespaceID !== 'NOT_SHARED' ? namespaceID : undefined

    const data = { ids: ids };
    const url = apiURLs.share.getBulk
    const resp = await API.share
      .getBulk(data)
      .then((d) => {
        if (d) {
          if (d.failed.length > 0) mog('Failed API Requests: ', { url, ids: d.failed })

          d.successful.forEach((node) => {
            const content = deserializeContent(node.data)
            const metadata = extractMetadata(node)

            updateFromContent(node.id, content, metadata)
          })

          return d.successful
        }
      })
    return resp;
  }

  const getAllNamespaces = async () => {
    const namespaces = await API.namespace
      .getAll()
      .then((d: any) => {
        // mog('namespaces all', d.data)
        return d.map((item: any) => {
          // metadata is json string parse to object
          return {
            ns: {
              id: item.id,
              name: item.name,
              icon: item.metadata?.icon ?? undefined,
              access: item.accessType,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              granterID: item.granterID ?? undefined,
              publicAccess: item.publicAccess
            },
            nodeHierarchy: item.nodeHierarchy.map((i) => ({ ...i, namespace: item.id })),
            archiveHierarchy: item?.archivedNodeHierarchyInformation
          }
        })
      })
      .catch((e) => {
        mog('Error fetching all namespaces', { e })
        return undefined
      })

    if (namespaces) {
      const newILinks = namespaces.reduce((arr, { nodeHierarchy }) => {
        return [...arr, ...nodeHierarchy]
      }, [])
      const localILinks = useDataStore.getState().ilinks

      // mog('update namespaces and ILinks', { namespaces, newILinks })
      const ns = namespaces.map((n) => n.ns)
      setNamespaces(ns)

      const { toUpdateLocal } = iLinksToUpdate(localILinks, newILinks)

      const batches = batchArrayWithNamespaces(toUpdateLocal, ns, 10)
      mog('BatchesInGetAllNamespaces', { batches, toUpdateLocal, localILinks, newILinks })
      const promises = []
      Object.entries(batches).forEach(([namespaceID, idBatches]) => {
        idBatches.forEach((ids) => promises.push(bulkGetNodes(ids, namespaceID)))
      })
      setILinks(newILinks)
      await runBatch(promises)
    }
  }

  const getNamespace = async (id: string) => {
    const namespace = await API.namespace
      .get(id)
      .then((d: any) => {
        mog('namespaces specific', { data: d, id })
        // return d?.nodeHierarchy

        return {
          id: d?.id,
          name: d?.name,
          icon: d?.metadata?.icon ?? undefined,
          nodeHierarchy: d?.nodeHierarchy,
          createdAt: d?.createdAt,
          updatedAt: d?.updatedAt,
          publicAccess: d?.publicAccess
        }
      })
      .catch((e) => {
        mog('Save error', e)
        return undefined
      })

    return namespace
  }

  const getPublicNamespaceAPI = async (namespaceID: string) => {
    const res = await API.namespace.getPublic(namespaceID)
    return res
  }

  const makeNamespacePublic = async (namespaceID: string) => {
    const res = await API.namespace.makePublic(namespaceID)
    return res
  }

  const makeNamespacePrivate = async (namespaceID: string) => {
    const res = await API.namespace.makePrivate(namespaceID)
    return res
  }

  const createNewNamespace = async (name: string) => {
    try {
      const namespaceID = generateNamespaceId()
      const t = Date.now()
      const req = {
        type: 'NamespaceRequest',
        name,
        id: namespaceID,
        metadata: {
          iconUrl: 'heroicons-outline:view-grid'
        }
      }
      mog("req",{req});
      const res = await API.namespace.create(req).then((d: any) => ({
        id: req.id,
        name: name,
        iconUrl: req.metadata.iconUrl,
        access: 'MANAGE' as const,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }))

      mog('We created a namespace', { res })

      return res
    } catch (err) {
      toast('Unable to Create New Namespace')
    }
  }

  const changeNamespaceName = async (id: string, name: string) => {
    try {
      const res = await API.namespace.update({ id, name }).then(() => true)
      return res
    } catch (err) {
      throw new Error('Unable to update namespace')
    }
  }

  const changeNamespaceIcon = async (id: string, name: string, icon: MIcon) => {
    try {
      const res = await API.namespace
        .update({
          id,
          name,
          metadata: { icon }
        })
        .then(() => icon)
      return res
    } catch (err) {
      throw new Error('Unable to update namespace icon')
    }
  }

  const shareNamespace = async (id: string, userIDs: string[], accessType: AccessLevel) => {
    try {
      const res = await API.namespace.share(id, userIDs, accessType)
      mog('Shared a namespace', { res })
      return res
    } catch (err) {
      throw new Error(`Unable to share namespace: ${err}`)
    }
  }
  const revokeNamespaceShare = async (id: string, userIDs: string[]) => {
    try {
      const res = await API.namespace.revokeAccess(id, userIDs)
      mog('revoke access users', res)
      return res
    } catch (err) {
      throw new Error(`Unable to revoke namespace access: ${err}`)
    }
  }

  const updateNamespaceShare = async (id: string, userIDToAccessTypeMap: { [userid: string]: AccessLevel }) => {
    try {
      return await API.namespace.updateAccess(id, userIDToAccessTypeMap).then((resp) => {
        mog('changeUsers resp', { resp })
        return resp
      })
    } catch (err) {
      throw new Error(`Unable to update namespace access: ${err}`)
    }
  }

  const getAllSharedUsers = async (id: string): Promise<{ users: Record<string, string> }> => {
    try {
      return await API.share.getNamespacePermissions(id).then((resp: any) => {
        mog('get all shared users', resp)
        return { users: resp }
      })
    } catch (err) {
      mog(`Unable to get shared namespace users: ${err}`)
      return { users: {} }
    }
  }

  // reminder
  const getReminder = async (id: string) => {
    const res = await API.reminder.get(id)
    return res
  }
  const getAllWorkspaceReminders = async () => {
    const res = await API.reminder.getAllOfWorkspace()
    return res
  }

  const getAllNodeReminders = async (nodeId: string) => {
    const res = await API.reminder.getAllOfNode(nodeId)
    return res
  }

  const saveReminder = async (reminder: Reminder) => {
    const workspaceIdStr = getWorkspaceId()
    const reqData = {
      workspaceId: workspaceIdStr,
      // This is entity id
      nodeId: getReminderAssociatedId(reminder, workspaceIdStr),
      entityId: reminder.id,
      properties: reminder
    }

    // mog('Saving reminder', { reminder, reqData })
    const res = await API.reminder.save(reqData)
    return res
  }

  const deleteReminder = async (id: string) => {
    const res = await API.reminder.delete(id)
    return res
  }

  const deleteAllNode = async (nodeId: string) => {
    const res = await API.reminder.deleteAllOfNode(nodeId)
    return res
  }

  const addReaction = async (reaction: APIReaction) => {
    const reqData: ReactionRequests = {
      action: 'ADD',
      nodeId: reaction.nodeId,
      blockId: reaction.blockId,
      reaction: reaction.reaction
    }
    mog('Saving reaction', { reaction, reqData })
    const res = await API.reaction.react(reqData)
    return res
  }

  const deleteReaction = async (reaction: APIReaction) => {
    const reqData: ReactionRequests = {
      action: 'DELETE',
      nodeId: reaction.nodeId,
      blockId: reaction.blockId,
      reaction: reaction.reaction
    }
    mog('Deleting reaction', { reaction, reqData })
    const res = await API.reaction.react(reqData)
    return res
  }

  const getReactionsOfNote = async (nodeId: string, force = false) => {
    const res = await API.reaction.getAllOfNode(nodeId, {
      cache: true,
      expiry: GET_REQUEST_MINIMUM_GAP_IN_MS
    })
    return res
  }

  const getReactionsOfBlock = async (nodeId: string, blockId: string) => {
    const res = await API.reaction.getAllOfBlock(nodeId, blockId)
    return res
  }

  const getBlockReactionDetails = async (nodeId: string, blockId: string) => {
    const res = await API.reaction.getDetailedOfBlock(nodeId, blockId)
    return res
  }
  
  // comment
  const saveComment = async (comment: APIComment) => {
    const reqData = {
      nodeId: comment.nodeId,
      blockId: comment.blockId,
      threadId: comment.threadId,
      content: comment.content,
      entityId: comment.entityId
    }

    mog('Saving comment', { comment, reqData })
    const res = await API.comment.create(reqData)
    return res
  }

  const getComment = async (nodeid: string, id: string) => {
    const res = await API.comment.get(nodeid, id)
    return res
  }

  const deleteComment = async (nodeid: string, id: string) => {
    const res = await API.comment.delete(nodeid, id)
    return res
  }

  const getCommentsByNodeId = async (nodeId: string, force = false) => {
    const res = await API.comment.getAllOfNode(nodeId, {
      cache: true,
      expiry: GET_REQUEST_MINIMUM_GAP_IN_MS
    })
    return res
  }

  const deleteCommentsByNodeId = async (nodeId: string) => {
    const res = await API.comment.deleteAllOfNode(nodeId)
    return res
  }

  const getCommentsByBlockId = async (nodeId: string, blockId: string) => {
    const res = await API.comment.getAllOfBlock(nodeId, blockId)
    return res
  }

  const deleteCommentsByBlockId = async (nodeId: string, blockId: string) => {
    const res = await API.comment.deleteAllOfBlock(nodeId, blockId)
    return res
  }

  const getCommentsByThreadId = async (nodeId: string, blockId: string, threadId: string) => {
    const res = await API.comment.getAllOfThread(nodeId, blockId, threadId)
    return res
  }

  const deleteCommentsByThreadId = async (nodeId: string, blockId: string, threadId: string) => {
    const res = await API.comment.deleteAllOfThread(nodeId, blockId, threadId)
    return res
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
    appendToNode,
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
    workspaceHeaders,
    createNewNamespace,
    bulkGetNodes,
    getPublicNamespaceAPI,
    makeNamespacePublic,
    shareNamespace,
    revokeNamespaceShare,
    getAllSharedUsers,
    updateNamespaceShare,
    getNamespace,
    makeNamespacePrivate,
    getReminder,
    getAllWorkspaceReminders,
    getAllNodeReminders,
    saveReminder,
    deleteReminder,
    deleteAllNode,
    addReaction,
    deleteReaction,
    getReactionsOfNote,
    getReactionsOfBlock,
    getBlockReactionDetails,
    saveComment,
    getComment,
    deleteComment,
    getCommentsByNodeId,
    deleteCommentsByNodeId,
    getCommentsByBlockId,
    deleteCommentsByBlockId,
    getCommentsByThreadId,
    deleteCommentsByThreadId
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
