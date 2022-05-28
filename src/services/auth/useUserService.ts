import { apiURLs } from '@apis/routes'
import { useUserCacheStore } from '@store/useUserCacheStore'
import { mog } from '@utils/lib/helper'
import { client } from '@workduck-io/dwindle'

interface TempUser {
  email: string
  userID?: string
  alias?: string
}

interface TempUserUserID {
  userID: string
  email?: string
  alias?: string
}
export const useUserService = () => {
  const addUser = useUserCacheStore((s) => s.addUser)
  const getUser = useUserCacheStore((s) => s.getUser)
  const getUserDetails = async (email: string): Promise<TempUser> => {
    const user = getUser({ email })
    if (user) return user

    try {
      return await client.get(apiURLs.user.getFromEmail(email)).then((resp) => {
        mog('Response', { resp })
        if (resp?.data?.userId && resp?.data?.name) {
          addUser({ email, userID: resp?.data?.userId, alias: resp?.data?.name })
        }
        return { email, userID: resp?.data?.userId, alias: resp?.data?.name }
      })
    } catch (e) {
      mog('Error Fetching User Details', { error: e, email })
      return { email }
    }
  }

  const getUserDetailsUserId = async (userID: string): Promise<TempUserUserID> => {
    const user = getUser({ userID })
    if (user) return user
    try {
      return await client.get(apiURLs.user.getFromUserId(userID)).then((resp) => {
        mog('Response', { resp })
        if (resp?.data?.email) {
          addUser({ userID, email: resp?.data?.email, alias: resp?.data?.name })
        }
        return { userID, email: resp?.data?.email ?? undefined }
      })
    } catch (e) {
      mog('Error Fetching User Details', { error: e, userID })
      return { userID }
    }
  }
  return { getUserDetails, getUserDetailsUserId }
}
