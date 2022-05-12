import { mog } from '@utils/lib/helper'
import { client } from '@workduck-io/dwindle'

export const usePermission = () => {
  const grantUsersPermission = (email: string) => {
    mog('changeThat permission')
  }

  const changeUserPermission = () => {
    mog('changeThat permission')
  }

  return { grantUsersPermission }
}
