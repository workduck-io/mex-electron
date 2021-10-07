import checkboxLine from '@iconify-icons/ri/checkbox-line'
import deleteBin2Line from '@iconify-icons/ri/delete-bin-2-line'
import { Icon } from '@iconify/react'
import { shell } from 'electron'
import React, { useEffect } from 'react'
import ConfirmationModal, { useConfirmationModalStore } from '../Components/ConfirmationModal/ConfirmationModal'
import NewSyncTemplateModal, { useNewSyncTemplateModalStore } from '../Components/Integrations/NewSyncBlockModal'
import { authURLs } from '../Components/Integrations/sampleServices'
import { useUpdater } from '../Data/useUpdater'
import { WORKSPACE_ID } from '../Defaults/auth'
import { ServiceLabel } from '../Editor/Components/SyncBlock'
import { getSyncServiceIcon } from '../Editor/Components/SyncBlock/SyncIcons'
import { useSyncStore } from '../Editor/Store/SyncStore'
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

const Integrations = () => {
  const openNewTemplateModal = useNewSyncTemplateModalStore((store) => store.openModal)
  const openConfirmationModal = useConfirmationModalStore((store) => store.openModal)
  const templates = useSyncStore((store) => store.templates)
  const services = useSyncStore((store) => store.services)
  const connectService = useSyncStore((store) => store.connectService)
  const { updateServices } = useUpdater()

  const handleDeleteCancel = () => undefined
  const handleDeleteConfirm = (templateId: string) => {
    console.log('Should delete', { templateId })
  }

  useEffect(() => {
    updateServices()
  }, [])

  const onConnectService = (id: string) => {
    const authUrl = authURLs[id](WORKSPACE_ID)
    // eslint-disable-next-line no-console
    shell.openExternal(authUrl)
    // store new services
    connectService(id)
  }

  console.log({ services })

  return (
    <Wrapper>
      <Title>Integrations</Title>
      <IntegrationsGrid>
        {services.map((s) => (
          <>
            {s.id !== 'MEX' && (
              <ServiceButton
                onClick={(e) => {
                  e.preventDefault()
                  if (!s.connected) onConnectService(s.id)
                }}
                key={`sButton_${s.id}`}
                color={s.styles.color}
                bgColor={s.styles.bgColor}
              >
                <ServiceIconWrapper>
                  <Icon height={64} icon={getSyncServiceIcon(s.id)} />
                  <h1>{capitalize(s.id)}</h1>
                </ServiceIconWrapper>
                <ServiceButtonFooter>
                  {s.connected ? (
                    <>
                      <Icon icon={checkboxLine} />
                      Service Active
                    </>
                  ) : (
                    'Click to connect service'
                  )}
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
      <NewSyncTemplateModal />
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
