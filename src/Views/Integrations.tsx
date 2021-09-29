import { Icon } from '@iconify/react'
import React from 'react'
import { useSyncStore } from '../Editor/Store/SyncStore'
import Switch from '../Components/Forms/Switch'
import NewSyncBlockModal, { useNewSyncTemplateModalStore } from '../Components/Integrations/NewSyncBlockModal'
import { sampleServices } from '../Components/Integrations/sampleServices'
import { getSyncServiceIcon } from '../Editor/Components/SyncBlock/SyncIcons'
import { capitalize } from '../Lib/strings'
import { Button } from '../Styled/Buttons'
import { IntegrationsGrid, ServiceButton, ServiceButtonFooter, ServiceIconWrapper } from '../Styled/Integrations'
import { Wrapper } from '../Styled/Layouts'
import { Title } from '../Styled/Typography'

const Integrations = () => {
  const openModal = useNewSyncTemplateModalStore((store) => store.openModal)
  const templates = useSyncStore((store) => store.templates)

  return (
    <Wrapper>
      <Title>Integrations</Title>
      <IntegrationsGrid>
        {sampleServices.map((s) => (
          <ServiceButton key={`sButton_${s.name}`} color={s.color} bgColor={s.bgColor}>
            <ServiceIconWrapper>
              <Icon height={64} icon={getSyncServiceIcon(s.name)} />
              <h1>{capitalize(s.name)}</h1>
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
      <br />

      {templates.map((t) => (
        <div key={t.id}>
          <p>{t.command}</p>
          <p>{t.id}</p>
        </div>
      ))}
    </Wrapper>
  )
}

export default Integrations
