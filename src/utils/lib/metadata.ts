import { NodeMetadata } from '../Types/data'
import { removeNulls } from './helper'

export const extractMetadata = (data: any): NodeMetadata => {
  const metadata: any = {
    lastEditedBy: data.lastEditedBy,
    updatedAt: data.updatedAt
  }
  if (data.createdBy !== null) {
    metadata.createdBy = data.createdBy
  }
  if (data.createdAt !== null) {
    metadata.createdAt = data.createdAt
  }
  return removeNulls(metadata)
}
