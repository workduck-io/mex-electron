import { Icon } from '@iconify/react'
import deleteBin2Line from '@iconify-icons/ri/delete-bin-2-line'
import React from 'react'
import { useSyncStore } from '../Editor/Store/SyncStore'
import Switch from '../Components/Forms/Switch'
import NewSyncBlockModal, { useNewSyncTemplateModalStore } from '../Components/Integrations/NewSyncBlockModal'
import { getSyncServiceIcon } from '../Editor/Components/SyncBlock/SyncIcons'
import { capitalize } from '../Lib/strings'
import IconButton, { Button } from '../Styled/Buttons'
import {
  IntegrationsGrid,
  ServiceButton,
  ServiceButtonFooter,
  ServiceIconWrapper,
  SlashCommand,
  SlashCommandPrefix,
  Template,
  TemplatesGrid
} from '../Styled/Integrations'
import { SpaceBetweenHorizontalFlex, Wrapper } from '../Styled/Layouts'
import { Note, Title } from '../Styled/Typography'
import { ServiceLabel } from '../Editor/Components/SyncBlock'
import ConfirmationModal, { useConfirmationModalStore } from '../Components/ConfirmationModal/ConfirmationModal'

const Integrations = () => {
  const openNewTemplateModal = useNewSyncTemplateModalStore((store) => store.openModal)
  const openConfirmationModal = useConfirmationModalStore((store) => store.openModal)
  const templates = useSyncStore((store) => store.templates)
  const services = useSyncStore((store) => store.services)

  const handleDeleteCancel = () => undefined
  const handleDeleteConfirm = (templateId: string) => {
    console.log('Should delete', { templateId })
  }

  return (
    <Wrapper>
      <Title>Integrations</Title>
      <IntegrationsGrid>
        {services.map((s) => (
          <>
            {s.id !== 'mex' && (
              <ServiceButton key={`sButton_${s.id}`} color={s.styles.color} bgColor={s.styles.bgColor}>
                <ServiceIconWrapper>
                  <Icon height={64} icon={getSyncServiceIcon(s.id)} />
                  <h1>{capitalize(s.id)}</h1>
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
            )}
          </>
        ))}
      </IntegrationsGrid>

      <Title>Templates</Title>
      <Button size="large" primary onClick={() => openNewTemplateModal()}>
        New SyncBlock Template
      </Button>
      <NewSyncBlockModal />
      <br />

      <TemplatesGrid>
        {templates.map((t) => (
          <Template key={t.id}>
            <SpaceBetweenHorizontalFlex>
              <SlashCommand>
                <SlashCommandPrefix>/sync.</SlashCommandPrefix>
                {t.command}
              </SlashCommand>
              <IconButton
                icon={deleteBin2Line}
                title="Delete Template"
                onClick={() => {
                  openConfirmationModal(t.id, `Delete: ${t.title}?`, 'Are you sure you want to delete the template?')
                }}
              />
            </SpaceBetweenHorizontalFlex>
            <Title>{t.title}</Title>
            <Note>{t.description}</Note>
            {t.intents.map((i) => (
              <ServiceLabel key={`${i.service}_${i.type}`}>
                <Icon icon={getSyncServiceIcon(i.service)} />
                {i.service} - {i.type}
              </ServiceLabel>
            ))}
            {/* <p>{t.id}</p> */}
          </Template>
        ))}
      </TemplatesGrid>

      <ConfirmationModal confirmKeyword="Delete" onCancel={handleDeleteCancel} onConfirm={handleDeleteConfirm} />
    </Wrapper>
  )
}

export default Integrations
