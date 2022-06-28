import React, { useState } from 'react'
import { useSpring } from 'react-spring'
import Tippy from '@tippyjs/react'
import { StyledTab, TabBody, TabsWrapper, TabsContainer, TabHeaderContainer, TabPanel } from './styled'
import { TooltipTitleWithShortcut } from '@components/mex/Shortcuts'
import { PollActions } from '@store/useApiStore'

export type TabType = {
  label: JSX.Element | string
  component: JSX.Element
  type: PollActions
  tooltip?: string
}

type TabsProps = {
  tabs: Array<TabType>
  openedTab: PollActions
  onChange: (pollAction: PollActions) => void
  visible?: boolean
}

const Tabs: React.FC<TabsProps> = ({ tabs, openedTab, onChange, visible }) => {
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
    <TabsContainer style={animationProps} visible={visible}>
      <TabHeaderContainer>
        <TabsWrapper index={index}>
          {tabs.map((tab) => (
            <Tippy delay={200} key={tab.type} theme="mex" content={<TooltipTitleWithShortcut title={tab.tooltip} />}>
              <StyledTab key={tab.type} onClick={() => onChange(tab.type)} selected={tab.type === openedTab}>
                {tab.label}
              </StyledTab>
            </Tippy>
          ))}
        </TabsWrapper>
      </TabHeaderContainer>
      <TabPanel style={bodyAnimation}>
        <TabBody onClick={() => onChange(openedTab)}>{tabs[index]?.component}</TabBody>
      </TabPanel>
    </TabsContainer>
  )
}

export default Tabs