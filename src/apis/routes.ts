import config from '../config.json'
import { IS_DEV } from '../data/Defaults/dev_'

type AllNamespaceOption = 'onlyShared' | 'onlyWorkspace'

//TODO: Need to remove
export const BASE_INTEGRATION_URL = 'https://http.workduck.io/integration'

export const integrationURLs = {
  createTemplate: `${BASE_INTEGRATION_URL}/sync/template`,
  getIntentValues: `${BASE_INTEGRATION_URL}/intents/value`,
  listen: (param: string) => `${BASE_INTEGRATION_URL}/listen?${param}`,
  intentGroup: (isNew: boolean) => `${BASE_INTEGRATION_URL}/sync/intent/multiple?isNew=${isNew ? 'true' : 'false'}`,
  getWorkspaceAuth: (workspaceId: string) => `${BASE_INTEGRATION_URL}/workspace/${workspaceId}/auth`,
  getAllServiceData: (workspaceId: string) => `${BASE_INTEGRATION_URL}/workspace/${workspaceId}/services/all`,
  getTemplateDetails: (templateId: string) => `${BASE_INTEGRATION_URL}/templates/${templateId}/details`,
  getAllTemplates: (workspaceId: string) => `${BASE_INTEGRATION_URL}/workspace/${workspaceId}/templates/all`
}

export const MEXIT_FRONTEND_BASE_URL = IS_DEV ? 'http://localhost:3333' : 'https://mexit.workduck.io'

export const MEXIT_BACKEND_URL_BASE = IS_DEV
  ? 'http://localhost:5002/api/v1'
  : 'https://mexit-backend-staging.workduck.io/api/v1'

export const IMAGE_API_BASE = 'https://http.workduck.io'

export const WORKDUCK_API_BASE =
  config.constants.STAGE === 'alpha' ? 'https://http-staging.workduck.io' : 'https://http.workduck.io'

export const MEX_LOCH_BASE_URL = `${WORKDUCK_API_BASE}/loch`

export const CDN_BASE = 'https://cdn.workduck.io'

// export const ACTION_ENV = IS_DEV ? 'test' : 'prod'
export const ACTION_ENV = config.constants.STAGE === 'alpha' ? 'staging' : 'prod'

export const GOOGLE_OAUTH_URL = `${MEXIT_FRONTEND_BASE_URL}/oauth/google`
export const GOOGLE_CAL_BASE = 'https://www.googleapis.com/calendar/v3/calendars'
export const GOOGLE_OAUTH2_REFRESH_URL = `${MEXIT_BACKEND_URL_BASE}/oauth2/getGoogleAccessToken`

export const API_URL = config.constants.MEX_BACKEND_BASE_URL

const BASE_URLS = {
  archive: `${MEXIT_BACKEND_URL_BASE}/node/archive`,
  unarchive: `${MEXIT_BACKEND_URL_BASE}/node/unarchive`,
  namespace: `${MEXIT_BACKEND_URL_BASE}/namespace`,
  node: `${MEXIT_BACKEND_URL_BASE}/node`,
  snippet: `${MEXIT_BACKEND_URL_BASE}/snippet`,
  loch: `${MEX_LOCH_BASE_URL}/connect`,
  share: `${MEXIT_BACKEND_URL_BASE}/shared`,
  user: `${MEXIT_BACKEND_URL_BASE}/user`,
  view: `${MEXIT_BACKEND_URL_BASE}/view`,
  link: `${MEXIT_BACKEND_URL_BASE}/link`,
  reminder: `${MEXIT_BACKEND_URL_BASE}/reminder`,
  comment: `https://http-staging.workduck.io/comment`,
  reaction: `https://http-staging.workduck.io/reaction`,
  frontend: IS_DEV ? 'http://localhost:3333' : 'https://mexit.workduck.io'
}

export const apiURLs = {
  archive: {
    archiveNodes: `${BASE_URLS.archive}`,
    deleteArchivedNodes: `${BASE_URLS.archive}/delete`,
    getArchivedNodes: `${BASE_URLS.archive}`,
    unArchiveNodes: `${BASE_URLS.unarchive}`,
    archiveInNamespace: (namespaceId: string) => `${BASE_URLS.archive}/${namespaceId}`
  },

  // Namespaces
  namespaces: {
    getHierarchy: `${BASE_URLS.namespace}/all/hierarchy?getMetadata=true`,
    get: (id: string) => `${BASE_URLS.namespace}/${id}`,
    // https://localhost:4000/v1/namespace/all?onlyShared=&onlyWorkspace=
    getAll: (opt?: AllNamespaceOption) => `${BASE_URLS.namespace}/all${opt ? `?${opt}=true` : ''}`,
    create: `${BASE_URLS.namespace}`,
    update: `${BASE_URLS.namespace}`,
    delete: `${BASE_URLS.namespace}/share`,
    makePublic: (id: string) => `${BASE_URLS.namespace}/makePublic/${id}`,
    makePrivate: (id: string) => `${BASE_URLS.namespace}/makePrivate/${id}`,
    share: `${BASE_URLS.namespace}/share`,
    getUsersOfShared: (id: string) => `${BASE_URLS.namespace}/shared/${id}/users`
  },

  node: {
    get: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/node/${uid}`,
    create: `${BASE_URLS.node}`,
    append: (uid: string) => `${BASE_URLS.node}/${uid}`,
    bulkCreate: `${BASE_URLS.node}/bulk`,
    refactor: `${BASE_URLS.node}/refactor`,
    makePublic: (uid: string) => `${BASE_URLS.node}/${uid}/makePublic`,
    makePrivate: (uid: string) => `${BASE_URLS.node}/${uid}/makePrivate`,
    getMultipleNode: (namespaceID?: string) =>
      `${BASE_URLS.node}/ids${namespaceID ? `?namespaceID=${namespaceID}` : ''}`
  },
  share: {
    sharedNode: `${BASE_URLS.share}`,
    allSharedNodes: `${BASE_URLS.share}/all`,
    getSharedNode: (nodeid: string) => `${BASE_URLS.share}/${nodeid}`,
    updateNode: `${BASE_URLS.share}/update`,
    getUsersOfSharedNode: (nodeid: string) => `${BASE_URLS.share}/${nodeid}/users`,
    getBulk: `${BASE_URLS.share}/ids`
  },

  snippet: {
    create: BASE_URLS.snippet,
    getAllSnippetsByWorkspace: `${BASE_URLS.snippet}/all`,
    getById: (uid: string) => `${BASE_URLS.snippet}/${uid}`,
    bulkGet: `${BASE_URLS.snippet}/ids`,
    deleteAllVersionsOfSnippet: (uid: string) => `${BASE_URLS.snippet}/${uid}/all`,
    deleteSpecificVersionOfSnippet: (uid: string, version?: number) =>
      `${BASE_URLS.snippet}/${uid}${version ? `?version=${version}` : ''}`
  },

  loch: {
    getAllServices: `${BASE_URLS.loch}/all`,
    getConnectedServices: `${BASE_URLS.loch}`,
    connectToService: `${BASE_URLS.loch}`,
    updateParentNoteOfService: `${BASE_URLS.loch}`
  },
  frontend: {
    getPublicNodePath: (uid: string) => `${MEXIT_FRONTEND_BASE_URL}/share/${uid}`,
    getPublicNSURL: (id: string) => `${MEXIT_FRONTEND_BASE_URL}/share/namespace/${id}`,
    getPublicURLofNoteInNS: (namespaceid: string, noteid: string) =>
      `${MEXIT_FRONTEND_BASE_URL}/share/namespace/${namespaceid}/node/${noteid}`
  },
  user: {
    getUserRecords: `${BASE_URLS.user}/`,
    registerUser: `${BASE_URLS.user}/register`,
    getFromEmail: (email: string) => `${BASE_URLS.user}/email/${encodeURIComponent(email)}`,
    getFromUserId: (userId: string) => `${BASE_URLS.user}/${encodeURIComponent(userId)}`,
    updateInfo: `${BASE_URLS.user}/update`,
    getUserByLinkedin: `${BASE_URLS.user}/linkedin`
  },
  // Views
  view: {
    saveView: `${WORKDUCK_API_BASE}/task/view`,
    deleteView: (id: string) => `${WORKDUCK_API_BASE}/task/view/${id}`,
    getAllViews: `${WORKDUCK_API_BASE}/task/view/all/workspace`
  },
  reminders: {
    saveReminder: BASE_URLS.reminder,
    reminderByID: (id: string) => `${BASE_URLS.reminder}/${id}`,
    remindersOfNode: (nodeID: string) => `${BASE_URLS.reminder}/node/${nodeID}`,
    remindersOfWorkspace: `${BASE_URLS.reminder}/workspace`
  },
  public: {
    getPublicNS: (id: string) => `${MEXIT_BACKEND_URL_BASE}/public/namespace/${id}`,
    getPublicNode: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/public/${uid}`
  },
  // Google OAuth
  getGoogleAuthUrl: () => `${MEXIT_BACKEND_URL_BASE}/oauth2/getGoogleAuthUrl`,

  // Bookmarks
  // post to add
  // path to delete
  bookmark: (userId: string, nodeid: string) => `${API_URL}/userBookmark/${userId}/${nodeid}`,
  getBookmarks: (userId: string) => `${API_URL}/userBookmark/${userId}`,
  // Archive
  getArchiveNotesHierarchy: () => `${API_URL}/workspace/hierarchy/archived`
}
