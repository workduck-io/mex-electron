import React, { useEffect, useState } from 'react'

import { tinykeys } from '@workduck-io/tinykeys'
import useDataStore from '@store/useDataStore'
import { TagsLabel } from '@components/mex/Tags/TagLabel'
import useLayout from '@hooks/useLayout'
import { Icon } from '@iconify/react'
import { useEditorStore } from '@store/useEditorStore'
import { useLayoutStore } from '@store/useLayoutStore'
import Tippy from '@tippyjs/react'
import { TitleWithShortcut } from '@workduck-io/mex-components'
import {
  SidebarToggle,
  SpaceHeader,
  SpaceSeparator,
  SpaceTitle,
  SpaceTitleFakeInput,
  SpaceTitleWrapper
} from '../Sidebar.style'
import { SidebarSpace } from '../Sidebar.types'
import { Input } from '@style/Form'
import { RESERVED_NAMESPACES } from '@utils/lib/paths'
import toast from 'react-hot-toast'
import { useNamespaces } from '@hooks/useNamespaces'
import IconPicker from '@ui/components/IconPicker/IconPicker'
import { MIcon } from '../../../types/Types'
import { Tooltip } from '@components/FloatingElements/Tooltip'

const Header = ({ space }: { space: SidebarSpace }) => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  // const node = useEditorStore((store) => store.node)
  const toggleSidebar = useLayoutStore((store) => store.toggleSidebar)
  const focusMode = useLayoutStore((state) => state.focusMode)
  const isUserEdititng = useEditorStore((store) => store.isEditing)
  const { getFocusProps } = useLayout()
  const inpRef = React.useRef<HTMLInputElement>(null)
  const titleRef = React.useRef<HTMLDivElement>(null)
  const { changeNamespaceName, changeNamespaceIcon } = useNamespaces()
  const [showInput, setShowInput] = useState(false)
  const [title, setTitle] = useState(space?.label ?? 'Space')

  const onChangeName = (name: string) => {
    // mog('onChangeName', { name })
    if (!name) return
    const namespaceNames = useDataStore
      .getState()
      .namespaces.filter((ns) => ns.id !== space?.id)
      .map((ns) => ns.name)
    const allowRename =
      !namespaceNames.includes(name) && name !== RESERVED_NAMESPACES.default && name !== RESERVED_NAMESPACES.shared

    if (allowRename) {
      changeNamespaceName(space?.id, name)
      setTitle(name)
    } else {
      toast.error('Space already exists!')
      if (inpRef.current) {
        inpRef.current.value = space?.label
        setTitle(space?.label)
      }
    }

    setShowInput(false)
  }

  const onChangeIcon = (icon: MIcon) => {
    changeNamespaceIcon(space?.id, space?.label, icon)
  }

  useEffect(() => {
    if (inpRef.current) {
      if (showInput) {
        inpRef.current.focus()
      }
      const unsubscribe = tinykeys(inpRef.current, {
        Enter: (event: KeyboardEvent) => {
          event.preventDefault()
          const name = inpRef.current?.value
          onChangeName(name)
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [inpRef, showInput])

  const isNamespaceInputDisabled =
    space?.label === RESERVED_NAMESPACES.default || space?.label === RESERVED_NAMESPACES.shared

  const isNamespaceIconDisabled = isNamespaceInputDisabled
  const showTags = space?.popularTags && space?.popularTags.length > 0
  const showSeparator = showTags

  return (
    <>
      <SpaceHeader>
        <SpaceTitleWrapper>
          <SpaceTitle>
            <IconPicker
              size={20}
              allowPicker={!isNamespaceIconDisabled}
              onChange={onChangeIcon}
              value={space?.icon ?? { type: 'ICON', value: 'heroicons-outline:view-grid' }}
            />
            {showInput && !isNamespaceInputDisabled ? (
              <Input defaultValue={space?.label} onBlur={(e) => onChangeName(e.target.value)} ref={inpRef} />
            ) : (
              <Tooltip content="Click to rename Space">
                <SpaceTitleFakeInput
                  ref={titleRef}
                  onClick={() => {
                    setShowInput(true)
                  }}
                >
                  {title}
                </SpaceTitleFakeInput>
              </Tooltip>
            )}
          </SpaceTitle>
          <Tippy
            theme="mex-bright"
            placement="right"
            content={<TitleWithShortcut title={sidebar?.expanded ? 'Collapse Sidebar' : 'Expand Sidebar'} />}
          >
            <SidebarToggle isVisible={!isUserEdititng} onClick={toggleSidebar} {...getFocusProps(focusMode)}>
              <Icon
                icon={sidebar.expanded ? 'heroicons-solid:chevron-double-left' : 'heroicons-solid:chevron-double-right'}
              />
            </SidebarToggle>
          </Tippy>
        </SpaceTitleWrapper>
        {/*space.pinnedItems && <space.pinnedItems />*/}
        {showTags && <TagsLabel tags={space?.popularTags} />}
      </SpaceHeader>
      {showSeparator && <SpaceSeparator />}
    </>
  )
}

export default Header
