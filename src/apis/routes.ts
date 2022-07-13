import config from '../config.json'
import { IS_DEV } from '../data/Defaults/dev_'

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
  ? 'http://localhost:5000/api/v1'
  : 'https://mex-webapp-dev.workduck.io/api/v1'

export const WORKDUCK_API_BASE = 'https://http.workduck.io'
export const MEX_LOCH_BASE_URL =
  config.constants.STAGE === 'alpha' ? 'https://http-test.workduck.io' : 'https://http.workduck.io'

export const CDN_BASE = 'https://cdn.workduck.io'

// export const ACTION_ENV = IS_DEV ? 'test' : 'prod'
export const ACTION_ENV = config.constants.STAGE === 'alpha' ? 'test' : 'prod'

export const GOOGLE_OAUTH_URL = `${MEXIT_FRONTEND_BASE_URL}/oauth/google`
export const GOOGLE_CAL_BASE = 'https://www.googleapis.com/calendar/v3/calendars'
export const GOOGLE_OAUTH2_REFRESH_URL = `${MEXIT_BACKEND_URL_BASE}/oauth2/getGoogleAccessToken`

// NO ending `/`
export const API_URL = !IS_DEV
  ? 'https://fsqucmv3of.execute-api.us-east-1.amazonaws.com'
  : config.constants.MEX_BACKEND_BASE_URL

export const apiURLs = {
  //node
  saveNode: `${API_URL}/node`,
  bulkSaveNodes: `${API_URL}/node/bulkCreate`,
  getNode: (nodeid: string) => `${API_URL}/node/${nodeid}`,

  // * User Preference
  // getUserPreferences: (userId: string) => `${BASE_API_URL}/userPreference/all/${userId}`,
  // getPreference: (userId: string, preferenceType: string) =>
  //   `${BASE_API_URL}/userPreference/${userId}/${preferenceType}`,
  // saveUserPrefernces: () => `${BASE_API_URL}/userPreference`,

  // Bookmarks
  // post to add
  // path to delete
  bookmark: (userId: string, nodeid: string) => `${API_URL}/userBookmark/${userId}/${nodeid}`,
  getBookmarks: (userId: string) => `${API_URL}/userBookmark/${userId}`,

  // User
  getUserRecords: `${config.constants.USER_SERVICE_BASE_URL}/`,
  registerUser: `${API_URL}/user/register`,

  // Archive
  archiveNodes: () => `${API_URL}/node/archive/middleware`,
  deleteArchiveNodes: () => `${API_URL}/node/archive/delete`,
  getArchivedNodes: (workspaceId: string) => `${API_URL}/node/archive/${workspaceId}`,
  getArchiveNotesHierarchy: () => `${API_URL}/workspace/hierarchy/archived`,
  unArchiveNodes: () => `${API_URL}/node/unarchive`,

  // * Loch
  getLochServices: () => `${MEX_LOCH_BASE_URL}/loch/connect/all`,
  getConnectedLochServices: () => `${MEX_LOCH_BASE_URL}/loch/connect`,
  connectToLochService: () => `${MEX_LOCH_BASE_URL}/loch/connect`,
  updateParentNoteOfService: () => `${MEX_LOCH_BASE_URL}/loch/connect`,

  // Image CDN
  createImageURL: `${WORKDUCK_API_BASE}/testing/upload/s3`,
  getImagePublicURL: (path: string) => `${CDN_BASE}/${path}`,

  // Google OAuth
  getGoogleAuthUrl: () => `${MEXIT_BACKEND_URL_BASE}/oauth2/getGoogleAuthUrl`,

  // Workspace
  // createWorkspace: `${BASE_API_URL}/workspace`,
  getNodesByWorkspace: (workspaceId: string) => `${API_URL}/node/workspace/${workspaceId}/namespace/NAMESPACE1`,
  getHierarchy: () => `${API_URL}/workspace/hierarchy?getMetadata=true`,
  refactor: `${API_URL}/node/refactor`,

  // Share options
  makeNotePublic: (uid: string) => `${API_URL}/node/makePublic/${uid}`,
  makeNotePrivate: (uid: string) => `${API_URL}/node/makePrivate/${uid}`,
  getPublicNote: (uid: string) => `${API_URL}/public/${uid}`,
  getNotePublicURL: (uid: string) => `${MEXIT_FRONTEND_BASE_URL}/share/${uid}`,

  user: {
    getFromEmail: (email: string) => `${config.constants.USER_SERVICE_BASE_URL}/email/${encodeURIComponent(email)}`,
    getFromUserId: (userId: string) => `${config.constants.USER_SERVICE_BASE_URL}/${encodeURIComponent(userId)}`,
    updateInfo: `${config.constants.USER_SERVICE_BASE_URL}/info`
  },

  // Snippets
  createSnippet: `${MEXIT_BACKEND_URL_BASE}/snippet`,
  getAllSnippetsByWorkspace: `${MEXIT_BACKEND_URL_BASE}/snippet/all`,
  getSnippetById: (uid: string) => `${MEXIT_BACKEND_URL_BASE}/snippet/${uid}`,

  // Sharing
  // Post type determines action
  sharedNode: `${API_URL}/shared/node`,
  allSharedNodes: `${API_URL}/shared/node/all`,

  getSharedNode: (nodeid: string) => `${API_URL}/shared/node/${nodeid}`,
  updateSharedNode: `${API_URL}/shared/node/update`,
  getUsersOfSharedNode: (nodeid: string) => `${API_URL}/shared/node/${nodeid}/users`
}
