// import { NodeMetadata } from '../Types/data'
import { NodeMetadata } from '../../types/data'
import { removeNulls } from './helper'

export const extractMetadata = (data: any): NodeMetadata => {
  const metadata: any = {
    lastEditedBy: data.lastEditedBy,
    updatedAt: data.updatedAt,
    createdBy: data.createdBy,
    createdAt: data.createdAt
  }
  return removeNulls(metadata)
}
