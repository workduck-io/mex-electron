import React, { useState } from 'react'

import { useApi } from '@apis/useSaveApi'
import { CopyButton } from '@components/mex/Buttons/CopyButton'
import globalLine from '@iconify/icons-ri/global-line'
import { useEditorStore } from '@store/useEditorStore'
import { CardTitle } from '@style/Integration'
import { MexIcon } from '@style/Layouts'
import Loading from '@style/Loading'
import { mog } from '@utils/lib/mog'
import { transparentize } from 'polished'
import styled, { css, useTheme } from 'styled-components'

import ToggleButton from '../ToggleButton'

const Flex = css`
  display: flex;
  align-items: center;
  background: ${({ theme }) => transparentize(0.5, theme.colors.background.card)};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`

const Container = styled.div`
  ${Flex}
  padding: ${({ theme }) => theme.spacing.medium} 0;
`

const ItemDesc = styled.div`
  margin-top: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.8rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ShareOptions = () => {
  const node = useEditorStore((store) => store.node)
  const theme = useTheme()

  const [isLoading, setIsLoading] = useState(false)
  const { makeNotePrivate, makeNotePublic, getPublicURL } = useApi()
  const publicUrl = getPublicURL(node.nodeid)

  const flipPublicAccess = async () => {
    setIsLoading(true)
    // Go from public -> private
    if (publicUrl) {
      try {
        const resp = await makeNotePrivate(node.nodeid)
        mog('MakingNodePrivateResp', { resp })
      } catch (error) {
        mog('Error in making link private', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Private to Public
      try {
        const resp = await makeNotePublic(node.nodeid)
        mog('MakingNodePulicResp', { resp })
      } catch (error) {
        mog('Error in making link public', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Container>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        <MexIcon color={theme.colors.primary} icon={globalLine} fontSize={24} margin="0 1rem 0 0" />
        <div style={{ gap: '1', userSelect: 'none' }}>
          <CardTitle>Make this node public?</CardTitle>
          <ItemDesc>Publish and share the link with everyone!</ItemDesc>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '.5rem' }}>
          {publicUrl && (
            <CopyButton text={publicUrl} size="20px" beforeCopyTooltip="Copy link" afterCopyTooltip="Link copied!" />
          )}
        </span>
        {isLoading ? (
          <Loading dots={3} transparent />
        ) : (
          <ToggleButton
            id="toggle-public"
            value={!!publicUrl}
            size="sm"
            onChange={flipPublicAccess}
            checked={!!publicUrl}
          />
        )}
      </div>
    </Container>
  )
}

export default ShareOptions
