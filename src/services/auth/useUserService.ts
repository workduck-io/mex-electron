import { USER_SERVICE_EMAIL_URL } from '@apis/routes'
import { mog } from '@utils/lib/helper'
import { client } from '@workduck-io/dwindle'

export const useUserService = () => {
  const getUserDetails = async (email: string) => {
    return await client.get(USER_SERVICE_EMAIL_URL(email)).then((resp) => {
      mog('Response', { resp })
      return resp
    })
  }

  return { getUserDetails }
}
