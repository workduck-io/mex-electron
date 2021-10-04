import { Intent } from '../Editor/Components/SyncBlock'

// eslint-disable-next-line no-prototype-builtins
export const isIntent = (p: any): p is Intent => p.hasOwnProperty('value')
