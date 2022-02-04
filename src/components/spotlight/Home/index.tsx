import React, { useState } from 'react'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { initActions } from '../../../data/Actions'
import { ActionType, MexitAction } from './actionExecutor'
import List from './components/List'
import useDataStore from '../../../store/useDataStore'

const Home = () => {
  const [currentAction, setCurrentAction] = useState<MexitAction>()
  const ilinks = useDataStore((state) => state.ilinks)
  const recents = useRecentsStore((state) => state.lastOpened)

  const recentList = recents.map((nodeid: string) => {
    const item = ilinks.find((link) => link.nodeid === nodeid)
    const listItem: MexitAction = {
      id: item?.nodeid,
      icon: item?.icon ?? 'gg:file-document',
      title: item?.path,
      description: '',
      type: ActionType.ilink,
      data: {
        nodeid: item?.nodeid,
        path: item?.path
      }
    }

    return listItem
  })

  const data = [...recentList, ...initActions]

  return <List data={data} currentAction={currentAction} setCurrentAction={setCurrentAction} />
}

export default Home
