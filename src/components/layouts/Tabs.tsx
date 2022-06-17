import React, { useState } from 'react'
import { useSpring } from 'react-spring'
import { StyledTab, TabBody, TabsContainer, TabHeaderContainer, TabPanel } from './styled'

type TabType = {
  label: JSX.Element | string
  component: JSX.Element
  key: string | number
}

type TabsProps = {
  tabs: Array<TabType>
  openedTab: number
  onChange: (index: number) => void
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

  return (
    <TabsContainer style={animationProps} visible={visible}>
      <TabHeaderContainer>
        {tabs.map((tab, tabIndex) => (
          <StyledTab key={tabIndex} onClick={() => onChange(tabIndex)} selected={tabIndex === openedTab}>
            {tab.label}
          </StyledTab>
        ))}
      </TabHeaderContainer>
      <TabPanel style={bodyAnimation}>
        <TabBody onClick={() => onChange(openedTab)}>{tabs[openedTab]?.component}</TabBody>
      </TabPanel>
    </TabsContainer>
  )
}

export default Tabs
