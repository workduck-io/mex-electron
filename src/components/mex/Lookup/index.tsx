import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import NodeSelect, { QuickLink, QuickLinkType } from '../NodeSelect/NodeSelect'
import React, { useEffect, useState } from 'react'
import { StyledCombobox, StyledInputWrapper } from '../NodeSelect/NodeSelect.styles'
import styled from 'styled-components'

import { Input } from '../../../style/Form'
import Modal from 'react-modal'
import { tinykeys } from '@workduck-io/tinykeys'
import toast from 'react-hot-toast'
import { useHelpStore } from '../../../store/useHelpStore'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useNavigation } from '../../../hooks/useNavigation'
import useOnboard from '../../../store/useOnboarding'
import { useSnippetStore } from '../../../store/useSnippetStore'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { mog } from '@workduck-io/mex-utils'

const StyledModal = styled(Modal)`
  z-index: 10010000;
  width: 40rem;
`

export const Brackets = styled.span`
  padding: 0.6rem;
  font-size: 1.6rem;
  background-color: ${(props) => props.theme.colors.form.input.bg};
  color: ${(props) => props.theme.colors.text.disabled};
  font-weight: 500;
  opacity: 0.4;
`

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin: ${({ theme }) => theme.spacing.large} 0;
  transition: all 0.2s ease-in-out;
  width: 440px;

  ${StyledCombobox} {
    ${Input}, ${StyledInputWrapper} {
      width: auto;
      flex-shrink: 1;
      flex-grow: 1;
      border: 1px solid ${({ theme }) => theme.colors.form.input.bg};
    }
    ${Input} {
      border-radius: 0;
      padding: ${(props) => props.theme.spacing.medium} 8px;
    }
  }
`

const Lookup = () => {
  const [open, setOpen] = useState(false)
  const [tempClose, setTempClose] = useState(false)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const setStep = useOnboard((s) => s.setStep)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const { createNewNote } = useCreateNewNote()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)

  const { goTo, location } = useRouting()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const openModal = () => {
    setOpen(true)
    // searchInput.current.focus();
  }

  const closeModal = () => {
    setOpen(false)
  }

  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showLookup.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showLookup, () => {
          openModal()
          if (isOnboarding) {
            changeOnboarding(false)
            setTempClose(true)
            setStep(2) // * Start with Tour node
          }
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled, isOnboarding])

  const { push } = useNavigation()

  const openNode = (quickLink: QuickLink) => {
    if (quickLink.type === QuickLinkType.snippet) {
      loadSnippet(quickLink.nodeid)
      goTo(ROUTE_PATHS.snippet, NavigationType.push, quickLink.nodeid)
    } else {
      const nodeid = quickLink.nodeid

      push(nodeid)
      goTo(ROUTE_PATHS.node, NavigationType.push, nodeid)
    }
    closeModal()
  }

  const handleSelectItem = (quickLink: QuickLink) => {
    if (tempClose) {
      if (quickLink.value === 'tour') {
        changeOnboarding(true)
        openNode(quickLink)
        // performClick()
      } else toast('Please select "tour" node')
    } else {
      const path = location.pathname
      if (`${ROUTE_PATHS.node}/${quickLink.nodeid}` === path) {
        // mog('This value is already opened', {})
        closeModal()
        return
      }
      openNode(quickLink)
    }
  }

  const handleCreateItem = (inputValue: QuickLink) => {
    if (tempClose) return
    mog('VALUE IS', { inputValue })
    createNewNote({ path: inputValue.value, namespace: inputValue?.namespace })
    closeModal()
  }

  return (
    <StyledModal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <InputWrapper>
        <Brackets>[[</Brackets>
        <NodeSelect
          id="lookup"
          name="lookup"
          menuOpen
          showAll
          autoFocus
          prefillRecent
          menuOverlay={false}
          handleSelectItem={handleSelectItem}
          handleCreateItem={handleCreateItem}
        />
        <Brackets>]]</Brackets>
      </InputWrapper>
      {/* <LookupInput autoFocus menuOpen handleChange={handleChange} handleCreate={handleCreate} /> */}
    </StyledModal>
  )
}

export default Lookup
