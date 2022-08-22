import { devtools } from 'zustand/middleware'

const applyStoreMiddleware = (func) => devtools(func)

export default applyStoreMiddleware
