import { FAKE_APP_URI } from './../Defaults/dev_'
import tough from 'tough-cookie'
import WebStorageCookieStore from 'tough-cookie-web-storage-store'
import { SEPARATOR } from '../Components/Sidebar/treeUtils'
import { NodeEditorContent } from '../Editor/Store/Types'
import { ELEMENT_PARAGRAPH } from '@udecode/plate'

export const electronCookies = () => {
  const { Cookie } = tough

  ;(function (document) {
    const store = new WebStorageCookieStore(localStorage)
    const cookiejar = new tough.CookieJar(store, { rejectPublicSuffixes: false })
    Object.defineProperty(document, 'cookie', {
      get() {
        return cookiejar.getCookieStringSync(FAKE_APP_URI)
      },
      set(cookie) {
        cookiejar.setCookieSync(Cookie.parse(cookie), FAKE_APP_URI)
      }
    })
  })(document)
}

export const withoutContinuousDelimiter = (text: string, delimiter = SEPARATOR) => {
  const key = text
    .split(delimiter)
    .filter((ch) => ch !== '')
    .join(delimiter)

  if (text.startsWith(delimiter) && key.length > 0) return { key: `.${key}`, isChild: true }
  return { key, isChild: false }
}

export const removeNulls = (obj: any): any => {
  if (obj === null) {
    return undefined
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      obj[key] = removeNulls(obj[key])
    }
  }
  return obj
}

export const updateEmptyBlockTypes = (content: NodeEditorContent, type: string = ELEMENT_PARAGRAPH) => {
  content.forEach((element) => {
    if (!element.type) {
      element['type'] = type
    }

    if (element.children && element.children.length > 0) {
      updateEmptyBlockTypes(element.children, type)
    }
  })
}
