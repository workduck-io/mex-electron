// import { electronCookies } from '../Lib/helper'

import { electronCookies } from '../../utils/lib/helper'

const analytics = (url: string, id: string) => {
  window.heap = window.heap || []

  const onLoad = (appId, heapConfig = {}) => {
    electronCookies()

    window.heap.appid = appId
    window.heap.config = heapConfig

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = !0
    script.src = `${url}${appId}.js`

    const firstScript = document.getElementsByTagName('script')[0]
    firstScript.parentNode.insertBefore(script, firstScript)

    const cloneArray = (arrayLike) => Array.prototype.slice.call(arrayLike, 0)

    const createMethod = function (method) {
      return function () {
        // eslint-disable-next-line prefer-rest-params
        window.heap.push([method, ...cloneArray(arguments)])
      }
    }

    const methods = [
      'track',
      'identify',
      'resetIdentity',
      'addUserProperties',
      'setEventProperties',
      'unsetEventProperty',
      'addEventProperties',
      'clearEventProperties',
      'removeEventProperty'
    ]

    for (const method of methods) {
      window.heap[method] = createMethod(method)
    }
  }

  onLoad(id)
}

export default analytics
