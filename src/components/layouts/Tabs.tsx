import React, { useState } from 'react'
import { useSpring } from 'react-spring'
import Tippy from '@tippyjs/react'
import { StyledTab, TabBody, TabsWrapper, TabsContainer, TabHeaderContainer, TabPanel } from './styled'
import { InfobarMode } from '@store/useLayoutStore'
import { TitleWithShortcut } from '@workduck-io/mex-components'

export enum SidebarTab {
  'hierarchy' = 'hierarchy',
  'shared' = 'shared',
  'bookmarks' = 'bookmarks'
}

export type SingleTabType = SidebarTab | InfobarMode

export type TabType = {
  label: JSX.Element | string
  component: JSX.Element
  type: SingleTabType
  tooltip?: string
  shortcut?: string
}

type TabsProps = {
  tabs: Array<TabType>
  openedTab: SingleTabType
  onChange: (tabType: SingleTabType) => void
  visible?: boolean
  wrapperRef?: React.RefObject<HTMLDivElement>
}

const Tabs: React.FC<TabsProps> = ({ tabs, openedTab, wrapperRef, onChange, visible }) => {
  const [previousTab, setPreviousTab] = useState(openedTab)

  const animationProps = useSpring({
    from: { opacity: visible ? 0 : 1 },
    to: { opacity: visible ? 1 : 0 }
  })

  const bodyAnimation = useSpring({
    from: { height: visible ? '50%' : '100%' },
    to: { height: visible ? '100%' : '0' }
  })

  if (openedTab !== previousTab) setPreviousTab(openedTab)

  const index = tabs.findIndex((tab) => tab.type === openedTab)

  return (
    <TabsContainer style={animationProps} $visible={visible}>
      <TabHeaderContainer>
        <TabsWrapper index={index} total={tabs.length}>
          {tabs.map((tab) => (
            <Tippy
              delay={200}
              key={tab.type}
              theme="mex-bright"
              content={<TitleWithShortcut shortcut={tab.shortcut} title={tab.tooltip} />}
            >
              <StyledTab key={tab.type} onClick={() => onChange(tab.type)} selected={tab.type === openedTab}>
                {tab.label}
              </StyledTab>
            </Tippy>
          ))}
        </TabsWrapper>
      </TabHeaderContainer>
      <TabPanel style={bodyAnimation}>
        <TabBody ref={wrapperRef} onClick={() => onChange(openedTab)}>
          {tabs[index]?.component}
        </TabBody>
      </TabPanel>
    </TabsContainer>
  )
}

export default Tabs
