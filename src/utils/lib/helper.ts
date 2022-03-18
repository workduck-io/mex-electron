import { FAKE_APP_URI, IS_DEV } from '../../data/Defaults/dev_'

import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { NodeEditorContent } from '../../types/Types'
import { NodeProperties } from '../../store/useEditorStore'
import { SEPARATOR } from '../../components/mex/Sidebar/treeUtils'
import WebStorageCookieStore from 'tough-cookie-web-storage-store'
import { generateNodeUID } from '../../data/Defaults/idPrefixes'
import tough from 'tough-cookie'

type MogOptions = {
  pretty: boolean
  collapsed: boolean
}

export const mog = (
  title: string,
  propertiesToLog?: Record<string, any>,
  options: Partial<MogOptions> = { pretty: false, collapsed: true }
) => {
  if (IS_DEV) {
    if (!propertiesToLog) {
      console.log(title)
      return
    }

    options.collapsed ? console.groupCollapsed(title) : console.group(title)
    Object.entries(propertiesToLog).forEach(([key, value]) => {
      console.info(`${key}: `, options?.pretty ? JSON.stringify(value, null, 2) : value)
    })
    console.groupEnd()
  }
}

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

export const createNodeWithUid = (key: string): NodeProperties => ({
  title: key,
  id: key,
  nodeid: generateNodeUID(),
  path: key
})

/*
 * Checks for links that start with  the separator (.) and returns key and whether it is a child node i.e. starting with the separator
 * Also removes multiple separator invocations like "a.b....c..d"
 */
export const withoutContinuousDelimiter = (text: string, delimiter = SEPARATOR) => {
  const key = text
    .split(delimiter)
    .filter((ch) => ch.trim() !== '')
    .map((ch) => ch.trim())
    .join(delimiter)

  if (text?.startsWith(delimiter) && key.length > 0) return { key: `${delimiter}${key}`, isChild: true }
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

export const insertItemInArray = <T>(array: T[], item: T, index: number): Array<T> => [
  ...array.slice(0, index),
  item,
  ...array.slice(index)
]

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
