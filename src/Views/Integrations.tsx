import React from 'react'
import { Title } from '../Styled/Typography'
import { Wrapper } from '../Styled/Layouts'
import { IntegrationsGrid, ServiceButton, ServiceButtonFooter, ServiceIconWrapper } from '../Styled/Integrations'
import Switch from '../Components/Forms/Switch'
import { Icon } from '@iconify/react'
import { getSyncServiceIcon } from '../Editor/Components/SyncBlock/SyncIcons'

const sampleServices = [
  {
    name: 'slack',
    title: 'Slack',
    connected: false,
    color: '#d48fad',
    bgColor: '#3F0F3F'
  },

  {
    name: 'telegram',
    title: 'Telegram',
    connected: false,
    color: '#ffffff',
    bgColor: '#0088cc'
  },

  {
    name: 'notion',
    title: 'Notion',
    connected: false,
    color: '#121212',
    bgColor: '#ffffff'
  },

  {
    name: 'github',
    title: 'Github',
    connected: false,
    color: '#000000',
    bgColor: '#ffffff'
  }
]

const Integrations = () => {
  return (
    <Wrapper>
      <Title>Integrations</Title>
      <IntegrationsGrid>
        {sampleServices.map((s) => (
          <ServiceButton key={`sButton_${s.name}`} color={s.color} bgColor={s.bgColor}>
            <ServiceIconWrapper>
              <Icon height={64} icon={getSyncServiceIcon(s.name)} />
              <h1>{s.title}</h1>
            </ServiceIconWrapper>
            <ServiceButtonFooter>
              <p>{s.connected ? 'Service Active' : 'Connect Service to use'}</p>
              <Switch
                showLabel
                id={`switch_${s}_service`}
                value={s.connected}
                onChange={() => console.log('toggle')}
              ></Switch>
            </ServiceButtonFooter>
          </ServiceButton>
        ))}
      </IntegrationsGrid>
    </Wrapper>
  )
}

export default Integrations
