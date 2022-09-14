import React, { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { MexIcon } from '@workduck-io/mex-components'
import { StyledModal, AnimateZoom, FleetStyled, FleetSection, FleetSectionTitle } from './styled'

type FleetSectionType = {
  id: number
  name: string
  color?: string
  icon?: string
  onSelect: () => void
}

type FleetProps = {
  sections: Array<FleetSectionType>
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

const Fleet = ({ sections, isOpen, onClose, onOpen }: FleetProps) => {
  const theme = useTheme()
  const [active, setActive] = useState(0)

  const switchBetweeenSections = (backwards?: boolean) => {
    setActive((s) => {
      const newIndex = backwards ? (s - 1 + sections.length) % sections.length : (s + 1) % sections.length
      return newIndex
    })
  }

  const isShortcutPressed = (e: KeyboardEvent) => {
    const pressedModifier = e.metaKey && !e.shiftKey && !e.ctrlKey && !e.altKey
    return e.code === 'KeyN' && pressedModifier
  }

  const handleSwitchSections = (e: KeyboardEvent) => {
    const isKeyN = e.code === 'KeyN'
    const isArrowLeft = e.key === 'ArrowLeft'
    const isArrowRight = e.key === 'ArrowRight'

    const switchSection = isKeyN || isArrowLeft || isArrowRight
    const backwards = (e.shiftKey || isArrowLeft) && !isArrowRight

    if (switchSection) {
      switchBetweeenSections(backwards)
    }
  }

  const onKeyDown = useCallback((event: KeyboardEvent) => {

    if (event.metaKey) {
      if (!isOpen) {
        if (isShortcutPressed(event)) {
          onOpen()
        }
      } else {
        handleSwitchSections(event)
      }
    }
  }, [isOpen])


  const onKeyUp = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Meta') {
      sections[active].onSelect()
      onClose()
    }
  }, [active])


  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    if (isOpen) window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [isOpen, onKeyUp, onKeyDown])

  return <StyledModal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={onClose} isOpen={isOpen}>
    <FleetStyled index={active} total={sections?.length}>
      {
        sections?.map(section => {
          const isActive = active === section?.id

          return <FleetSection highlight={isActive}>
            <AnimateZoom selected={isActive}>
              <MexIcon icon={section?.icon} width="40" height="40" color={isActive ? theme.colors.primary : theme.colors.text.default} />
            </AnimateZoom>
            <FleetSectionTitle>
              {section?.name}
            </FleetSectionTitle>
          </FleetSection>
        })
      }
    </FleetStyled >
  </ StyledModal>
}

export default Fleet 
