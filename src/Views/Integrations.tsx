import React from 'react'
import { Title } from '../Styled/Typography'
import { Wrapper } from '../Styled/Layouts'
import { IntegrationsGrid, ServiceButton, ServiceButtonFooter, ServiceIconWrapper } from '../Styled/Integrations'
import Switch from '../Components/Forms/Switch'
import { Icon } from '@iconify/react'
import { getSyncServiceIcon } from '../Editor/Components/SyncBlock/SyncIcons'
import { sampleServices } from '../Components/Integrations/sampleServices'
import NewSyncBlockModal, { useNewSyncTemplateModalStore } from '../Components/Integrations/NewSyncBlockModal'
import { Button } from '../Styled/Buttons'

const Integrations = () => {
  const openModal = useNewSyncTemplateModalStore((store) => store.openModal)

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

      <Button size="large" primary onClick={() => openModal()}>
        New Custom SyncBlock
      </Button>
      <NewSyncBlockModal />
    </Wrapper>
  )
}

export default Integrations
