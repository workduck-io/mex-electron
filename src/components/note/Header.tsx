import { getNameFromPath } from '@components/mex/Sidebar/treeUtils'
import { useLinks } from '@hooks/useLinks'
import { mog } from '@utils/lib/helper'
import React, { useMemo } from 'react'

type NoteHeaderType = {
  noteId: string
}

const Header = ({ noteId }: NoteHeaderType) => {
  const { getPathFromNodeid } = useLinks()

  mog("NOTE ID IS HERE", { noteId })

  const noteTitle = useMemo(() => {
    const notePath = getPathFromNodeid(noteId)
    if (notePath)
      return getNameFromPath(notePath)
  }, [noteId])



  return <>
    <h4>{noteTitle}</h4>
  </>
}

export default Header 
