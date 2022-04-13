import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import { usePlateEditorState } from '@udecode/plate'
import React, { useEffect } from 'react'
import IconButton from '../../style/Buttons'
import { removeId } from '../../utils/lib/content'

export const SnippetCopierButton = () => {
  const editor = usePlateEditorState()!

  const onCopy = () => {
    if (!editor || !editor.children) return
    const content = JSON.parse(JSON.stringify(editor.children))
    const idLessContent = removeId(content)

    console.log('copy', { editor, idLessContent })
    navigator.clipboard.writeText(JSON.stringify(idLessContent, null, 2))
  }

  return <IconButton size={24} icon={fileCopyLine} onClick={onCopy} title={'Copy snippet json to clipboard'} />
}
