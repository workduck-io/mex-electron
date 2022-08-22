import React, { useEffect, useState } from 'react'

import { useCreateNewNote } from '@hooks/useCreateNewNote'
import useModalStore, { ModalsType } from '@store/useModalStore'
import toast from 'react-hot-toast'
import Modal from 'react-modal'
import styled from 'styled-components'

import { tinykeys } from '@workduck-io/tinykeys'

import { useNavigation } from '../../../hooks/useNavigation'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useHelpStore } from '../../../store/useHelpStore'
import useOnboard from '../../../store/useOnboarding'
import { useSnippetStore } from '../../../store/useSnippetStore'
import { Input } from '../../../style/Form'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'
import NodeSelect, { QuickLink, QuickLinkType } from '../NodeSelect/NodeSelect'
import { StyledCombobox, StyledInputWrapper } from '../NodeSelect/NodeSelect.styles'

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
  const setModalOpen = useModalStore((store) => store.toggleOpen)
  const open = useModalStore((store) => store.open)
  const [tempClose, setTempClose] = useState(false)
  const isOnboarding = useOnboard((s) => s.isOnboarding)
  const setStep = useOnboard((s) => s.setStep)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const { createNewNote } = useCreateNewNote()
  const loadSnippet = useSnippetStore((store) => store.loadSnippet)

  const { goTo, location } = useRouting()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const openModal = () => {
    setModalOpen(ModalsType.lookup)
    // searchInput.current.focus();
  }

  const closeModal = () => {
    setModalOpen(undefined)
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
    createNewNote({ path: inputValue.value, namespace: inputValue?.namespace })
    closeModal()
  }

  return (
    <StyledModal
      className="ModalContent"
      overlayClassName="ModalOverlay"
      onRequestClose={closeModal}
      isOpen={open === ModalsType.lookup}
    >
      <h1 style={{ textAlign: 'center' }}>Lookup</h1>
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
