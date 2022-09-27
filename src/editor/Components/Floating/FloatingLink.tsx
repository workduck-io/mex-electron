import { Tooltip } from '@components/FloatingElements/Tooltip'
import { EditorIcons } from '@components/icons/Icons'
import { Icon } from '@iconify/react'
import { useFloatingLinkSelectors } from '@udecode/plate-link'
import { FloatingIconWrapper } from '@udecode/plate-ui-toolbar'
import React from 'react'
import {
  EditButton,
  FloatingDivider,
  FloatingLinkEditRoot,
  FloatingLinkInputWrapper,
  FloatingLinkInsertRoot,
  InputWrapper,
  OpenLinkButton,
  PlateFloatingCssDiv,
  TextInput,
  UnlinkButton,
  UrlInput
} from './FloatingLink.style'

export const PlateFloatingLink = () => {
  const isEditing = useFloatingLinkSelectors().isEditing()

  const input = (
    <FloatingLinkInputWrapper>
      <InputWrapper>
        <Tooltip content="URL of the link">
          <FloatingIconWrapper>
            <Icon width={18} icon={EditorIcons.externalLink} />
          </FloatingIconWrapper>
        </Tooltip>

        <UrlInput placeholder="Paste link" />
      </InputWrapper>

      <InputWrapper>
        <Tooltip content="Text to display">
          <FloatingIconWrapper>
            <Icon width={18} icon={EditorIcons.text} />
          </FloatingIconWrapper>
        </Tooltip>
        <TextInput placeholder="Text to display" />
      </InputWrapper>
    </FloatingLinkInputWrapper>
  )

  const editContent = !isEditing ? (
    <PlateFloatingCssDiv>
      <Tooltip content="Edit Link">
        <EditButton>
          <Icon icon={EditorIcons.edit} width={18} />
          Edit link
        </EditButton>
      </Tooltip>
      <FloatingDivider />

      <Tooltip content="Open Link">
        <OpenLinkButton>
          <Icon icon={EditorIcons.externalLink} width={18} />
        </OpenLinkButton>
      </Tooltip>

      <FloatingDivider />

      <Tooltip content="Unlink">
        <UnlinkButton>
          <Icon icon={EditorIcons.linkUnlink} width={18} />
        </UnlinkButton>
      </Tooltip>
    </PlateFloatingCssDiv>
  ) : (
    input
  )

  return (
    <>
      <FloatingLinkInsertRoot>{input}</FloatingLinkInsertRoot>

      <FloatingLinkEditRoot>{editContent}</FloatingLinkEditRoot>
    </>
  )
}
