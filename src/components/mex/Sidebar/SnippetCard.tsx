import { TagsLabel } from '@components/mex/Tags/TagLabel'
import SnippetPreview from '@editor/Components/EditorPreview/SnippetPreview'
import { useLastUsedSnippets } from '@hooks/useLastOpened'
import magicLine from '@iconify/icons-ri/magic-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { Icon } from '@iconify/react'
import { useSnippetStore } from '@store/useSnippetStore'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { convertContentToRawText, getTagsFromContent, mog } from '@workduck-io/mex-utils'
import { tinykeys } from '@workduck-io/tinykeys'
import React, { useEffect, useMemo } from 'react'
import { Snippet } from '../../../types/data'
import { RelativeTime } from '../RelativeTime'
import { SnippetCardFooter, SnippetCardHeader, SnippetCardWrapper, SnippetContentPreview } from './SnippetSidebar.style'

interface SnippetCardProps {
  snippet: Snippet
  keyStr: string

  // Show preview (default true)
  preview?: boolean
  icon?: boolean

  /**
   * Replace the default onclick action on node link
   */
  onClick?: (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const SnippetCard = ({ snippet, preview = true, icon, keyStr, onClick }: SnippetCardProps) => {
  const [visible, setVisible] = React.useState(false)
  const { goTo } = useRouting()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)
  const { getLastUsed } = useLastUsedSnippets()
  // const { push } = useNavigation()

  const onClickProps = (ev) => {
    // Show preview on click, if preview is shown, navigate to link
    ev.preventDefault()
    // ev.stopPropagation()

    if (onClick) {
      onClick(ev)
    } else {
      loadSnippet(snippet.id)
      goTo(ROUTE_PATHS.node, NavigationType.push, snippet.id)
    }

    if (!visible) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }

  const snippetTags = useMemo(() => {
    return getTagsFromContent(snippet.content).map((tag) => ({ value: tag }))
  }, [snippet])

  const lastUsed = getLastUsed(snippet.id)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        closePreview()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const closePreview = () => {
    setVisible(false)
  }

  // mog('SnippetCard', { snippet, lastUsed })

  return (
    <SnippetPreview
      key={keyStr}
      preview={visible}
      setPreview={setVisible}
      hover
      allowClosePreview
      snippetId={snippet.id}
      placement="left"
    >
      <SnippetCardWrapper>
        <SnippetCardHeader onClick={(e) => onClickProps(e)}>
          <Icon icon={snippet.template ? magicLine : quillPenLine} />
          {snippet.title}
        </SnippetCardHeader>

        <SnippetContentPreview>{convertContentToRawText(snippet.content, ' ')}</SnippetContentPreview>
        <SnippetCardFooter>
          <TagsLabel tags={snippetTags} />
          {lastUsed && (
            <RelativeTime
              tippy
              dateNum={lastUsed}
              prefix="Last used"
              refreshMs={1000 * 30}
              tippyProps={{ placement: 'left', theme: 'mex-bright' }}
            />
          )}
        </SnippetCardFooter>
      </SnippetCardWrapper>
    </SnippetPreview>
  )
}

export default SnippetCard
