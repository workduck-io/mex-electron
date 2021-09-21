import React from 'react'
import { Title } from '../Styled/Typography'
import { Wrapper } from '../Styled/Layouts'
import { IntegrationsGrid, ServiceButton } from '../Styled/Integrations'
import Switch from '../Components/Forms/Switch'
import { Icon } from '@iconify/react'
import { getSyncServiceIcon } from '../Editor/Components/SyncBlock/SyncIcons'

const sampleServices = [
  {
    name: 'slack',
    connected: false,
    color: '#E51670',
    bgColor: '#3F0F3F'
  },

  {
    name: 'telegram',
    connected: false,
    color: '#ffffff',
    bgColor: '#0088cc'
  },

  {
    name: 'notion',
    connected: false,
    color: '#121212',
    bgColor: '#ffffff'
  },

  {
    name: 'github',
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
            <Icon icon={getSyncServiceIcon(s.name)} />
            <h1>{s.name}</h1>
            <Switch
              showLabel
              id={`switch_${s}_service`}
              value={s.connected}
              onChange={() => console.log('toggle')}
            ></Switch>
          </ServiceButton>
        ))}
      </IntegrationsGrid>
    </Wrapper>
  )
}

export default Integrations
