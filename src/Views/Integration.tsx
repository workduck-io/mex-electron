import { Icon } from '@iconify/react'
import PlusCircle from '@iconify-icons/bi/plus-circle'
import Check from '@iconify-icons/bi/check'
import React, { useEffect } from 'react'
import { ServiceIcon } from '../Editor/Components/SyncBlock/SyncIcons'
import { useSyncStore } from '../Editor/Store/SyncStore'

import {
  IntegrationContainer,
  Title,
  ServiceCard,
  Services,
  TemplateContainer,
  TemplateList,
  PlusIcon,
  CenteredFlex,
  RightCut,
  ActiveStatus,
  ServiceName
} from '../Styled/Integration'

import Template from '../Components/Integrations/Template'
import { Service } from '../Editor/Components/SyncBlock'
import NewSyncTemplateModal, { useNewSyncTemplateModalStore } from '../Components/Integrations/NewSyncBlockModal'
import { shell } from 'electron'
import { camelCase } from '../Lib/strings'
import ConfirmationModal from '../Components/ConfirmationModal/ConfirmationModal'
import { useUpdater } from '../Data/useUpdater'

const NewTemplate = () => {
  const openNewTemplateModal = useNewSyncTemplateModalStore((store) => store.openModal)

  return (
    <>
      <PlusIcon onClick={() => openNewTemplateModal()}>
        <Icon height={64} icon={PlusCircle} />
      </PlusIcon>
      <NewSyncTemplateModal />
    </>
  )
}

const Service: React.FC<{ service: Service }> = ({ service }) => {
  const connectService = useSyncStore((store) => store.connectService)

  const onConnectService = (id: string, authUrl: string) => {
    shell.openExternal(authUrl)
    connectService(id)
  }

  const onServiceClick = (ev: any) => {
    ev.preventDefault()
    if (!service.connected && service.enabled) onConnectService(service.id, service.authUrl)
  }

  if (service.id === 'MEX') return null

  return (
    <ServiceCard onClick={onServiceClick} disabled={!service.enabled} hover={!service.connected}>
      {service.connected && (
        <>
          <RightCut />
          <ActiveStatus>
            <Icon height={24} icon={Check} />
          </ActiveStatus>
        </>
      )}
      <CenteredFlex>
        <ServiceIcon service={service.id} height="56" width="56" />
      </CenteredFlex>
      <ServiceName>{camelCase(service.id)}</ServiceName>
    </ServiceCard>
  )
}

const Integrations = () => {
  const services = useSyncStore((store) => store.services)

  return (
    <IntegrationContainer>
      <Title>Integrations</Title>
      <Services>
        {services.map((service) => (
          <Service key={service.id} service={service} />
        ))}
      </Services>
    </IntegrationContainer>
  )
}

const Templates = () => {
  const templates = useSyncStore((store) => store.templates)
  const deleteTemplate = useSyncStore((store) => store.deleteTemplate)

  const handleDeleteCancel = () => undefined
  const handleDeleteConfirm = (templateId: string) => {
    deleteTemplate(templateId)
  }

  return (
    <TemplateContainer>
      <Title>Templates</Title>
      <TemplateList>
        <NewTemplate />
        {templates.map((template) => (
          <Template key={template.id} template={template} />
        ))}
      </TemplateList>
      <ConfirmationModal confirmKeyword="Delete" onCancel={handleDeleteCancel} onConfirm={handleDeleteConfirm} />
    </TemplateContainer>
  )
}

const IntegrationPage = () => {
  const { updateServices } = useUpdater()

  useEffect(() => {
    (async () => {
      await updateServices()
    })()
  }, [])

  return (
    <>
      <Integrations />
      <Templates />
    </>
  )
}

export default IntegrationPage
