import React, { useMemo } from 'react'

import { RelativeTime } from '@components/mex/RelativeTime'
import { getNameFromPath } from '@components/mex/Sidebar/treeUtils'
import { ProjectTimeStyled } from '@components/spotlight/ActionStage/Project/ProjectTime'
import { useContentStore } from '@store/useContentStore'
import useDataStore from '@store/useDataStore'
import { mog } from '@utils/lib/helper'

import { NoteHeaderContainer, NoteTitle } from './styled'

type NoteHeaderType = {
  noteId: string
}

const Header = ({ noteId }: NoteHeaderType) => {
  const ilinks = useDataStore((store) => store.ilinks)
  const archive = useDataStore((store) => store.archive)
  const metadata = useContentStore((store) => store.contents?.[noteId]?.metadata)

  mog('ILINKS RECIEVED', { ilinks })

  const noteTitle = useMemo(() => {
    let notePath = ilinks.find((ilink) => ilink.nodeid === noteId)?.path
    if (!notePath) notePath = archive.find((ilink) => ilink.nodeid === noteId)?.path

    if (notePath) return getNameFromPath(notePath ?? '')
  }, [ilinks, archive])

  return (
    <NoteHeaderContainer>
      <NoteTitle>{noteTitle}</NoteTitle>
      {metadata?.updatedAt && <ProjectTimeStyled>{<RelativeTime dateNum={metadata.updatedAt} />}</ProjectTimeStyled>}
    </NoteHeaderContainer>
  )
}

export default Header
