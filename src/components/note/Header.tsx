import React, { useMemo } from 'react'

import { getNameFromPath } from '@components/mex/Sidebar/treeUtils'
import useDataStore from '@store/useDataStore'
import { useNamespaces } from '@hooks/useNamespaces'

import { NoteHeaderContainer, NoteTitle } from './styled'
import NamespaceTag from '@components/mex/NamespaceTag'

type NoteHeaderType = {
  noteId: string
}

const Header = ({ noteId }: NoteHeaderType) => {
  const ilinks = useDataStore((store) => store.ilinks)
  const archive = useDataStore((store) => store.archive)
  const { getNamespaceOfNode } = useNamespaces()
  const namespace = getNamespaceOfNode(noteId)

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
    <NoteHeaderContainer>
      <NoteTitle>{noteTitle}</NoteTitle>
      {namespace && <NamespaceTag namespace={namespace} />}
      {/*metadata?.updatedAt && <ProjectTimeStyled>{<RelativeTime dateNum={metadata.updatedAt} />}</ProjectTimeStyled>*/}
    </NoteHeaderContainer>
  )
}

export default Header
