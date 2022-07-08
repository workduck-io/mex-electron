import { SharedNodeIcon } from '@components/icons/Icons'
import { useEditorStore } from '@store/useEditorStore'
import { ItemContent, ItemTitle } from '@style/Sidebar'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React from 'react'
import { useTheme } from 'styled-components'
import { useNavigation } from '../../../hooks/useNavigation'
import useDataStore from '../../../store/useDataStore'
import { Centered } from './Bookmarks'
import { SItem } from './SharedNotes.style'

const SharedNotes = () => {
  const sharedNodes = useDataStore((store) => store.sharedNodes)
  const { push } = useNavigation()

  // const [sharedNodes, setSharedNodes] = useState<SharedNode[]>([])
  const { goTo } = useRouting()
  const theme = useTheme()
  const node = useEditorStore((s) => s.node)

  const onOpenNode = (nodeid: string) => {
    push(nodeid, { fetch: true })
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
  }

  return sharedNodes.length > 0 ? (
    <>
      {sharedNodes.map((sharedNode) => {
        return (
          <SItem
            selected={node?.nodeid === sharedNode.nodeid}
            key={`shared_notes_link_${sharedNode.nodeid}`}
            onClick={() => onOpenNode(sharedNode.nodeid)}
          >
            <ItemContent>
              <ItemTitle>
                <SharedNodeIcon />
                <span>{sharedNode.path}</span>
              </ItemTitle>
            </ItemContent>
          </SItem>
        )
      })}

      {/* <SharedBreak /> */}
    </>
  ) : (
    <Centered>
      <SharedNodeIcon height={22} width={22} fill={theme.colors.text.default} margin="0 0 1rem 0" />
      <span>No one has shared Notes with you yet!</span>
    </Centered>
  )
}

export default SharedNotes
