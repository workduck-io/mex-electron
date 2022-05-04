import React from 'react'
import { Button } from '../../../../style/Buttons'
import { DisplayShortcut } from '../../../mex/Shortcuts'
import { ShortcutText } from '../../Home/components/Item'
import { StyledDefault } from './styled'
import Tippy from '@tippyjs/react'

export type DefaultProps = {
  setIsOpen: any
  title: string
  shortcut: string
}

const Default: React.FC<DefaultProps> = ({ setIsOpen, title, shortcut }) => {
  const onDefaultClick = () => {
    setIsOpen(true)
  }

  return (
    <StyledDefault>
      <Tippy
        delay={100}
        interactiveDebounce={100}
        appendTo={() => document.body}
        theme="mex"
        content={
          <ShortcutText key="send">
            <DisplayShortcut shortcut="$mod+K" />
          </ShortcutText>
        }
      >
        <Button tabIndex={-1} onClick={onDefaultClick}>
          {title ?? 'Options'}
        </Button>
      </Tippy>
    </StyledDefault>
  )
}

export default Default
