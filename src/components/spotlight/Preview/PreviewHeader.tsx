import React, { useEffect } from 'react'

import { Tooltip } from '@components/FloatingElements/Tooltip'
import { FlexGap } from '@components/mex/Archive/styled'
import usePinnedWindows from '@hooks/usePinnedWindow'
import PinIconFilled from '@iconify/icons-ri/pushpin-2-fill'
import PinIcon from '@iconify/icons-ri/pushpin-2-line'
import { useSpotlightContext } from '@store/Context/context.spotlight'
import { useSpotlightAppStore } from '@store/app.spotlight'
import { useTheme } from 'styled-components'

import { DisplayShortcut, MexIcon } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { useSaveChanges } from '../Search/useSearchProps'
import { StyledPreviewHeader } from './styled'

type PreviewHeaderProps = {
  noteId: string
}

const PreviewHeader = ({ noteId }: PreviewHeaderProps) => {
  const theme = useTheme()
  const { isPinned, onPinNote, onUnpinNote } = usePinnedWindows()

  const { saveIt } = useSaveChanges()
  const { selection } = useSpotlightContext()

  const handlePinNote = (noteId: string) => {
    if (!isPinned(noteId)) {
      const isNormalMode = useSpotlightAppStore.getState().normalMode

      if (isNormalMode && selection) {
        saveIt({
          saveAndClose: true,
          saveToFile: false,
          notify: false,
          removeHighlight: true
        })
      }

      onPinNote(noteId)
    } else onUnpinNote(noteId)
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyP': (event) => {
        event.preventDefault()
        handlePinNote(noteId)
      }
    })

    return () => unsubscribe()
  }, [noteId])

  const isPinnedNote = isPinned(noteId)

  return (
    <StyledPreviewHeader>
      <Tooltip
        key={`${noteId}-pinned-tooltip`}
        content={
          <FlexGap>
            <DisplayShortcut shortcut="$mod+P" /> {`to ${isPinnedNote ? 'Unpin' : 'Pin'}`}
          </FlexGap>
        }
      >
        <MexIcon
          icon={isPinned(noteId) ? PinIconFilled : PinIcon}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()

            handlePinNote(noteId)
          }}
          height={16}
          width={16}
          color={theme.colors.primary}
        />
      </Tooltip>
    </StyledPreviewHeader>
  )
}

export default PreviewHeader
