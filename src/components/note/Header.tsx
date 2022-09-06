import { RelativeTime } from '@components/mex/RelativeTime'
import { getNameFromPath } from '@components/mex/Sidebar/treeUtils'
import { ProjectTimeStyled } from '@components/spotlight/ActionStage/Project/ProjectTime'
import { useLinks } from '@hooks/useLinks'
import { useContentStore } from '@store/useContentStore'
import { NoteTitle } from '@style/Editor'
import React, { useMemo } from 'react'
import { NoteHeaderContainer } from './styled'

type NoteHeaderType = {
  noteId: string
}

const Header = ({ noteId }: NoteHeaderType) => {
  const { getPathFromNodeid } = useLinks()
  const getMetadata = useContentStore(store => store.getMetadata)

  const { noteTitle, metadata } = useMemo(() => {
    const notePath = getPathFromNodeid(noteId)
    return {
      noteTitle: getNameFromPath(notePath),
      metadata: getMetadata(noteId)
    }
  }, [noteId])


  return <NoteHeaderContainer>
    <NoteTitle>{noteTitle}</NoteTitle>
    {
      metadata?.updatedAt && <ProjectTimeStyled>{<RelativeTime dateNum={metadata.updatedAt} />}</ProjectTimeStyled>
    }
  </NoteHeaderContainer>
}

export default Header 
