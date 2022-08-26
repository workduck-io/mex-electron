// import { NodeMetadata } from '../Types/data'
import { NodeMetadata } from '../../types/data'
import { removeNulls } from './helper'

export const extractMetadata = (data: any): NodeMetadata => {
  const metadata: any = {
    lastEditedBy: data.lastEditedBy,
    updatedAt: data.updatedAt,
    createdBy: data.createdBy,
    createdAt: data.createdAt,
    publicAccess: data?.publicAccess,
    iconUrl: data?.metadata?.iconUrl,
    templateID: data?.metadata?.templateID
  }
  return removeNulls(metadata)
}
