import { MEX_TAG } from '../data/Defaults/auth'

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

export const apiURLs = {
  //node
  saveNode: `${BASE_API_URL}/node`,
  getNode: (uid: string) => `${BASE_API_URL}/node/${uid}`,

  // * User Preference
  getUserPreferences: (userId: string) => `/userPreference/all/${userId}`,
  getPreference: (userId: string, preferenceType: string) => `/userPreference/${userId}/${preferenceType}`,
  saveUserPrefernces: () => `/userPreference`,

  // Bookmarks
  // post to add
  // path to delete
  bookmark: (userId: string, uid: string) => `${BOOKMARK_URL}/userBookmark/${userId}/${uid}`,
  getBookmarks: (userId: string) => `${BOOKMARK_URL}/userBookmark/${userId}`,

  // User
  getUserRecords: (userId: string) => `${BASE_USER_URL}/user/${userId}/${MEX_TAG}`,
  registerUser: `${BASE_API_URL}/user/register`,

  // Archive
  archiveNodes: () => `${BASE_API_URL}/node/archive`,
  deleteArchiveNodes: () => `${BASE_API_URL}/node/archive`,
  getArchivedNodes: (workspaceId: string) => `${BASE_API_URL}/node/archive/${workspaceId}`,
  unArchiveNodes: () => `${BASE_API_URL}/node/unarchive`,

  // Workspace
  createWorkspace: `${BASE_API_URL}/workspace`,
  getNodesByWorkspace: (workspaceId: string) => `${BASE_API_URL}/node/workspace/${workspaceId}/namespace/NAMESPACE1`,
  getWorkspace: (workspace_id: string) => `${BASE_API_URL}/workspace/${workspace_id}`
}