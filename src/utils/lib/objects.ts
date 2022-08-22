import { isEqual } from 'lodash'

const removeKeys = (obj: unknown, exclude: Array<string>) => {
  if (obj) {
    if (typeof obj === 'object') {
      exclude.forEach((key) => {
        delete obj[key]
      })

      Object.keys(obj).forEach((k) => removeKeys(obj[k], exclude))
    } else if (Array.isArray(obj)) {
      obj.forEach((a) => removeKeys(a, exclude))
    }
  }

  return obj
}

const checkIsEqual = (first: Record<string, any>, second: Record<string, any>, excludeKeys: Array<string>) => {
  const firstWithExcludeKeys = removeKeys(first, excludeKeys)
  const secondWithExcludedKeys = removeKeys(second, excludeKeys)

  return isEqual(firstWithExcludeKeys, secondWithExcludedKeys)
}

// * Exported functions
export { checkIsEqual, removeKeys }
