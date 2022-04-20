import { formatRFC3339 } from 'date-fns'
import { MEX_TAG } from '../data/Defaults/auth'
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

export const BASE_API_URL = 'https://http.workduck.io/mex'
export const BASE_USER_URL = 'https://http.workduck.io/user'

export const BOOKMARK_URL = BASE_API_URL
export const MEXIT_FRONTEND_BASE_URL = IS_DEV ? 'http://localhost:3333' : 'https://mexit.workduck.io'
// export const MEXIT_FRONTEND_BASE_URL = 'https://mexit.workduck.io'
export const MEXIT_BACKEND_URL_BASE = IS_DEV
  ? 'http://localhost:5000/api/v1'
  : 'https://mex-webapp-dev.workduck.io/api/v1'

export const WORKDUCK_API_BASE = 'https://http.workduck.io'
export const CDN_BASE = 'https://cdn.workduck.io'

export const GOOGLE_OAUTH_URL = `${MEXIT_FRONTEND_BASE_URL}/oauth/desktop`
export const GOOGLE_CAL_BASE = 'https://www.googleapis.com/calendar/v3/calendars'
// http://localhost:5000/api/v1/oauth2/getGoogleAccessToken
export const GOOGLE_OAUTH2_REFRESH_URL = `${MEXIT_BACKEND_URL_BASE}/oauth2/getGoogleAccessToken`
// http://localhost:5000/api/v1/googleservices/calendar
// http://localhost:5000/api/v1/googleservices/calendar/list?maxResults=5

export const TEST_API_URL = 'https://http-test.workduck.io/mex'
// export const TEST_USER_URL = 'https://qp5qf0k5sg.execute-api.us-east-1.amazonaws.com/'

export const apiURLs = {
  //node
  saveNode: `${TEST_API_URL}/node`,
  getNode: (nodeid: string) => `${TEST_API_URL}/node/${nodeid}`,

  // * User Preference
  // getUserPreferences: (userId: string) => `${BASE_API_URL}/userPreference/all/${userId}`,
  // getPreference: (userId: string, preferenceType: string) =>
  //   `${BASE_API_URL}/userPreference/${userId}/${preferenceType}`,
  // saveUserPrefernces: () => `${BASE_API_URL}/userPreference`,

  // Bookmarks
  // post to add
  // path to delete
  bookmark: (userId: string, nodeid: string) => `${TEST_API_URL}/userBookmark/${userId}/${nodeid}`,
  getBookmarks: (userId: string) => `${TEST_API_URL}/userBookmark/${userId}`,

  // User
  getUserRecords: (userId: string) => `${BASE_USER_URL}/user/${userId}/${MEX_TAG}`,
  registerUser: `${TEST_API_URL}/user/register`,

  // Archive
  archiveNodes: () => `${TEST_API_URL}/node/archive`,
  deleteArchiveNodes: () => `${TEST_API_URL}/node/archive`,
  getArchivedNodes: (workspaceId: string) => `${TEST_API_URL}/node/archive/${workspaceId}`,
  unArchiveNodes: () => `${TEST_API_URL}/node/unarchive`,

  // Image CDN
  createImageURL: `${WORKDUCK_API_BASE}/testing/upload/s3`,
  getImagePublicURL: (path: string) => `${CDN_BASE}/${path}`,

  // Google OAuth
  getGoogleAuthUrl: () => `${MEXIT_BACKEND_URL_BASE}/oauth2/getGoogleAuthUrl`,

  // Workspace
  // createWorkspace: `${BASE_API_URL}/workspace`,
  getNodesByWorkspace: (workspaceId: string) => `${BASE_API_URL}/workspace/${workspaceId}/namespace/NAMESPACE1`
  // getWorkspace: (workspace_id: string) => `${BASE_API_URL}/workspace/${workspace_id}`
}
