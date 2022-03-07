import React, { useEffect } from 'react'
import { ipcRenderer } from 'electron'
import { useEditorStore } from '../../../store/useEditorStore'
import { IpcAction } from '../../../data/IpcAction'
import { useBufferStore, useEditorBuffer } from '../../../hooks/useEditorBuffer'

const Outline = () => {
  const node = useEditorStore((s) => s.node)
  const { getBufferVal } = useEditorBuffer()
  const buffer = useBufferStore((s) => s.buffer)

  const prom = new Promise<any>((resolve) => {
    ipcRenderer.on(IpcAction.RECIEVE_ANALYIS, (_event, analysis: any) => {
      // console.log('We got the analysiss2', { _event, analysis })
      resolve(analysis)
    })
  })

  useEffect(() => {
    console.log('LOG_1')
    const content = getBufferVal(node.nodeid)
    console.log('We try analyse the content')
    ipcRenderer.send(IpcAction.ANALYSE_CONTENT, content)
    console.log('LOG_2')
    prom.then((analysis) => {
      console.log('We got the analysis', { analysis })
    })
  }, [node, buffer])

  console.log('LOG_RENDER')
  return <div>Outline</div>
}

export default Outline
