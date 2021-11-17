import { FAKE_APP_URI } from './../Defaults/dev_'
import tough from 'tough-cookie'
import WebStorageCookieStore from 'tough-cookie-web-storage-store'

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
