import React, { useEffect, useMemo } from 'react'

import NamespaceTag from '@components/mex/NamespaceTag'
import { getNameFromPath } from '@components/mex/Sidebar/treeUtils'
import Banner from '@editor/Components/Banner'
import { useNamespaces } from '@hooks/useNamespaces'
import useSocket from '@hooks/useSocket'
import useDataStore from '@store/useDataStore'
import useRouteStore, { BannerType } from '@store/useRouteStore'
import { ROUTE_PATHS } from '@views/routes/urls'

import { SocketActionType } from '../../types/socket'
import { NoteHeaderContainer, NoteTitle } from './styled'

type NoteHeaderType = {
  noteId: string
}

const Header = ({ noteId }: NoteHeaderType) => {
  const ilinks = useDataStore((store) => store.ilinks)
  const archive = useDataStore((store) => store.archive)
  const { getNamespaceOfNode } = useNamespaces()
  const namespace = getNamespaceOfNode(noteId)
  const fromSocket = useSocket()
  const isBannerVisible = useRouteStore((s) =>
    s.routes?.[`${ROUTE_PATHS.node}/${noteId}`]?.banners?.includes(BannerType.editor)
  )

  useEffect(() => {
    fromSocket.sendJsonMessage({
      action: SocketActionType.ROUTE_CHANGE,
      data: { route: `${ROUTE_PATHS.node}/${noteId}` }
    })
  }, [])
  const noteTitle = useMemo(() => {
    let notePath = ilinks.find((ilink) => ilink.nodeid === noteId)?.path
    if (!notePath) notePath = archive.find((ilink) => ilink.nodeid === noteId)?.path

    if (notePath) {
      const noteName = getNameFromPath(notePath ?? '')

      if (noteName) {
        document.title = noteName
      }

      return noteName
    }
  }, [ilinks, archive])

  return (
    <>
      {isBannerVisible && <Banner route={`${ROUTE_PATHS.node}/${noteId}`} title="Same Note is being accessed by multiple users. Data may get lost!" />}
      <NoteHeaderContainer>
        <NoteTitle>{noteTitle}</NoteTitle>
        {namespace && <NamespaceTag namespace={namespace} />}
        {/*metadata?.updatedAt && <ProjectTimeStyled>{<RelativeTime dateNum={metadata.updatedAt} />}</ProjectTimeStyled>*/}
      </NoteHeaderContainer>
    </>
  )
}

export default Header
