/**
 * ## Order of transformations
 *
 * Each value function receives the old object value.
 *
 * 1. Add
 * 2. Update
 * 2. Move
 * 3. Delete
 *
 */

// import { FileData } from '../types/data'
import { UpdateVersionTransforms } from '../data/transforms'
import { applyTransforms } from './dataTransform'

export const updateFileData = (data: any): { data: any; toWrite: boolean } => {
  let toWrite = false
  if (data.version) {
    return applyTransforms(data, UpdateVersionTransforms)
  } else {
    toWrite = true
    // const { fileData, toWriteFile } = ensureFieldsOnJSON(data)
    return applyTransforms(data, UpdateVersionTransforms)
  }
  return { data, toWrite }
}

export const testTransforms = () => {
  const t = UpdateVersionTransforms
  // const tdata = applyTransform(testdata, t)

  // console.log('Hellow', JSON.stringify({ testdata, tdata }, null, 2))
  // mog('We are transforming', )
}

testTransforms()
