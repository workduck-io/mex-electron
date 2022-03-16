import React, { useState } from 'react'
import styled, { css, useTheme } from 'styled-components'
import usePublicNode from '../../../hooks/usePublicNode'
import { useEditorStore } from '../../../store/useEditorStore'
import { CardTitle } from '../../../style/Integration'
import { MexIcon } from '../../../style/Layouts'
import ToggleButton from '../../spotlight/ToggleButton'
import globalLine from '@iconify/icons-ri/global-line'
import { ItemDesc } from '../../../editor/Components/tag/components/TagCombobox.styles'
import { CopyButton } from '../Buttons/CopyButton'
import { mog } from '../../../utils/lib/helper'
import Loading from '../../../style/Loading'
import { transparentize } from 'polished'
import { useSaver } from '../../../editor/Components/Saver'

const Flex = css`
  display: flex;
  align-items: center;
  background: ${({ theme }) => transparentize(0.5, theme.colors.background.card)};
  border-radius: ${({ theme }) => theme.borderRadius.large};
`

const Container = styled.div`
  ${Flex}
  padding: 1rem;
`

const PublicNode = () => {
  const node = useEditorStore((store) => store.node)
  const theme = useTheme()

  const [isLoading, setIsLoading] = useState(false)
  const { makeNodePrivate, makeNodePublic, isPublic } = usePublicNode()
  const publicUrl = isPublic(node.nodeid)
  const { onSave } = useSaver()

  const flipPublicAccess = async () => {
    // Go from public -> private
    setIsLoading(true)
    if (publicUrl) {
      try {
        const resp = await makeNodePrivate(node.nodeid)
      } catch (error) {
        mog('Error in making link private', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      // Private to Public
      try {
        onSave()
        const resp = await makeNodePublic(node.nodeid)
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
          <CardTitle>Make this node public</CardTitle>
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

export default PublicNode
