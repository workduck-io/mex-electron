import dayjs from 'dayjs'
import localFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localFormat)

export const getCurrentTimeString = (format: string): string => {
  return dayjs().format(format)
}
