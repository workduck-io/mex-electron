import { Icon } from '@iconify/react'
import { useEditorStore } from '@store/useEditorStore'
import { mog } from '@utils/lib/helper'
import { DefaultNodeIcon, getNodeIcon } from '@utils/lib/icons'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '../../../hooks/useNavigation'
import useDataStore from '../../../store/useDataStore'
import { SharedNode } from '../../../types/Types'
import { BList, SharedBreak, SItem, SItemContent } from './SharedNotes.style'

const SharedNotes = () => {
  const sharedNodesS = useDataStore((store) => store.sharedNodes)
  const { push } = useNavigation()
  const [sharedNodes, setSharedNodes] = useState<SharedNode[]>([])
  const { goTo } = useRouting()
  const node = useEditorStore((s) => s.node)

  useEffect(() => {
    // ssetBookmarks(
    // getAllBookmarks()
    setSharedNodes(sharedNodesS)
  }, [sharedNodesS])

  const onOpenNode = (nodeid: string) => {
    push(nodeid, { isShared: true, fetch: true })
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  return (
    <BList>
      {sharedNodes.length > 0 ? (
        <>
          {sharedNodes.map((sharedNode) => {
            return (
              <SItem
                selected={node?.nodeid === sharedNode.nodeid}
                key={`shared_notes_link_${sharedNode.nodeid}`}
                onClick={() => onOpenNode(sharedNode.nodeid)}
              >
                <SItemContent>
                  <Icon icon={getNodeIcon(sharedNode.path) ?? DefaultNodeIcon} />
                  {sharedNode.path}
                </SItemContent>
              </SItem>
            )
          })}

          <SharedBreak />
        </>
      ) : (
        <div>No one shared notes with you yet!</div>
      )}
    </BList>
  )
}

export default SharedNotes
