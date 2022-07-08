import lodash from 'lodash'
import { transparentize } from 'polished'
import React from 'react'
import Modal from 'react-modal'
import useShortcutTableData from '../../../hooks/useShortcutTableData'
import { useShortcutStore } from '../../../store/useShortcutStore'
import styled, { css } from 'styled-components'
import InputShortcut from '../Help/InputShortcut'
import { DisplayShortcut } from '../Shortcuts'

const Shortcut = styled.div<{ highlight: boolean }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  ${({ highlight, theme }) =>
    highlight &&
    css`
      border-radius: ${({ theme }) => theme.borderRadius.small};
      border: 0.1rem solid ${theme.colors.primary};
    `}
  :hover {
    background-color: ${({ theme }) => theme.colors.background.card};
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
`

const ShortcutItem = styled.div<{ highlight?: boolean }>`
  ${({ theme, highlight }) =>
    highlight
      ? css`
          background-color: ${transparentize(0.6, theme.colors.background.highlight)};
          border-radius: ${theme.borderRadius.small};
          padding: 0.5rem;
          margin-right: 0.5rem;
        `
      : css`
          padding: 1rem;
        `}
`

export const Header = styled.div<{ colored?: boolean }>`
  padding: 1rem;
  ${({ theme, colored }) =>
    colored &&
    css`
      color: ${theme.colors.primary};
    `}
  font-size: x-large;
  font-weight: bold;
`

const ShortcutListContainer = styled.section`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  margin: 0rem 4rem 2rem;
`

const ShortcutContent = styled.div`
  padding: 0;
  background-color: ${({ theme }) => transparentize(0.4, theme.colors.gray[9])};
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
`

const Shortcuts = () => {
  const { data } = useShortcutTableData()
  const grouped = lodash.groupBy(data, 'category')

  const editMode = useShortcutStore((state) => state.editMode)
  const setEditMode = useShortcutStore((state) => state.setEditMode)
  const currentShortcut = useShortcutStore((state) => state.currentShortcut)
  const setCurrentShortcut = useShortcutStore((state) => state.setCurrentShortcut)

  const onRowClick = (shortcut: any) => {
    setEditMode(true)
    setCurrentShortcut(shortcut)
  }

  return (
    <>
      {Object.keys(grouped).map((key) => {
        return (
          <ShortcutListContainer key={key}>
            <Header>{key}</Header>
            <ShortcutContent>
              {grouped[key].map((shortcut) => (
                <Shortcut
                  highlight={shortcut.title === currentShortcut?.title && editMode}
                  onClick={() => onRowClick(shortcut)}
                  key={shortcut.title}
                >
                  <ShortcutItem>{shortcut.title}</ShortcutItem>
                  <ShortcutItem highlight={true}>
                    <DisplayShortcut shortcut={shortcut.keystrokes} />
                  </ShortcutItem>
                </Shortcut>
              ))}
            </ShortcutContent>
          </ShortcutListContainer>
        )
      })}
      <Modal
        className="ModalContent"
        overlayClassName="ModalOverlay"
        onRequestClose={() => setEditMode(false)}
        isOpen={editMode}
      >
        <InputShortcut />
      </Modal>
    </>
  )
}

export default Shortcuts
