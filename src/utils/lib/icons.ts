// import { MexNodeIcons } from 'src/components/icons/Icons'
import { BASE_DRAFT_PATH, BASE_TASKS_PATH } from '../../data/Defaults/baseData'
import { isElder } from '../../components/mex/Sidebar/treeUtils'

export const getNodeIcon = (path: string) => {
  if (isElder(path, BASE_DRAFT_PATH)) {
    return 'ri:draft-line'
  }
  if (isElder(path, BASE_TASKS_PATH)) {
    return 'ri:task-line'
  }
}
