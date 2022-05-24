import { USER_SERVICE_EMAIL_URL } from '@apis/routes'
import { mog } from '@utils/lib/helper'
import { client } from '@workduck-io/dwindle'

export const useUserService = () => {
  const getUserDetails = async (email: string): Promise<{ email: string; userId?: string }> => {
    try {
      return await client.get(USER_SERVICE_EMAIL_URL(email)).then((resp) => {
        // mog('Response', { resp })
        return { email, userId: resp?.data?.userId ?? undefined }
      })
    } catch (e) {
      mog('Error Fetching User Details', { error: e, email })
      return { email, userId: undefined }
    }
  }

  return { getUserDetails }
}
