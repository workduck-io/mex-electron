import React, { useEffect } from 'react'
import Check from '@iconify-icons/bi/check'
import PlusCircle from '@iconify-icons/bi/plus-circle'
import { Icon } from '@iconify/react'
import { shell } from 'electron'
import ConfirmationModal from '../Components/ConfirmationModal/ConfirmationModal'
import NewSyncTemplateModal, { useNewSyncTemplateModalStore } from '../Components/Integrations/NewSyncBlockModal'
import Template from '../Components/Integrations/Template'
import { useUpdater } from '../Data/useUpdater'
import { Service } from '../Editor/Components/SyncBlock'
import { ServiceIcon } from '../Editor/Components/SyncBlock/SyncIcons'
import { useSyncStore } from '../Editor/Store/SyncStore'
import { camelCase } from '../Lib/strings'
import timeIcon from '@iconify-icons/bx/bx-time-five'
import {
  ActiveStatus,
  CenteredFlex,
  Flex,
  FullHeight,
  IntegrationContainer,
  PlusIcon,
  RightCut,
  ServiceCard,
  ServiceName,
  Services,
  TemplateTitle,
  TemplateContainer,
  TemplateList,
  Title,
  TemplateInfoList,
  StyledIcon,
  Text,
  Margin
} from '../Styled/Integration'
import { InfoBarWrapper } from '../Layout/InfoBar'
import { TemplateCommand } from '../Components/Integrations/Template/styled'
import { FlexBetween } from '../Editor/Components/InlineBlock/styled'
import { DateFormat, useRelativeTime as getRelativeTime } from '../Hooks/useRelativeTime'
import { useIntegrationStore } from '../Editor/Store/IntegrationStore'
import { client } from '@workduck-io/dwindle'
import { integrationURLs } from '../Requests/routes'
import useLoad from '../Hooks/useLoad/useLoad'
import { useHistory } from 'react-router'

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

const Service = (props: { service: Service }) => {
  const { service } = props
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
        <ServiceIcon service={service.id} height="56px" width="56px" />
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

const TemplateInfo = () => {
  const template = useIntegrationStore((state) => state.template)
  const templateDetails = useIntegrationStore((state) => state.templateDetails)
  const { getNode, loadNode } = useLoad()
  const history = useHistory()

  const onClick = (id: string) => {
    loadNode(id)
    history.push('/editor')
  }

  return (
    <InfoBarWrapper wide={false}>
      <TemplateTitle>Details</TemplateTitle>
      <TemplateCommand>{`/sync/${template.command}`}</TemplateCommand>
      {templateDetails && (
        <Margin>
          <Text>{`Total: ${templateDetails.length}`}</Text>
          <Text>{`Run: ${templateDetails.reduce((total, obj) => obj.runCount + total, 0)}`}</Text>
        </Margin>
      )}
      {templateDetails?.map((info) => (
        <TemplateInfoList key={'info'} onClick={() => onClick(info.node)}>
          <Text>{getNode(info.node).key}</Text>
          <Flex>
            <Text>{`Run Count: ${info.runCount}`}</Text>
          </Flex>
          {info.lastRun > 0 && (
            <Flex>
              <StyledIcon icon={timeIcon} />
              <Text>{DateFormat(info.lastRun)}</Text>
            </Flex>
          )}
        </TemplateInfoList>
      ))}
    </InfoBarWrapper>
  )
}

const Templates = () => {
  const templates = useSyncStore((store) => store.templates)
  const deleteTemplate = useSyncStore((store) => store.deleteTemplate)
  const selectTemplate = useIntegrationStore((store) => store.selectTemplate)
  const setTemplateDetails = useIntegrationStore((store) => store.setTemplateDetails)

  const handleDeleteCancel = () => undefined

  const handleDeleteConfirm = (ev, templateId: string) => {
    ev.stopPropagation()
    // deleteTemplate(templateId)
  }

  const onSelectTemplate = async (template) => {
    selectTemplate(template)
    await client.get(integrationURLs.getTemplateDetails(template.id)).then((d) => {
      const data = d.data
      if (data) {
        setTemplateDetails(data)
      }
    })
  }

  const { getTemplates } = useUpdater()

  useEffect(() => {
    getTemplates()
  }, [])

  return (
    <TemplateContainer>
      <Title>Templates</Title>
      <TemplateList>
        <NewTemplate />
        {templates.map((template) => (
          <Template onClick={onSelectTemplate} key={template.id} template={template} />
        ))}
      </TemplateList>
      {/* <ConfirmationModal
        confirmKeyword="Delete"
        onCancel={handleDeleteCancel}
        onConfirm={(ev) => handleDeleteConfirm(ev, template.id)}
      /> */}
    </TemplateContainer>
  )
}

const IntegrationPage = () => {
  const { updateServices } = useUpdater()
  const template = useIntegrationStore((state) => state.template)

  useEffect(() => {
    (async () => {
      await updateServices()
    })()
  }, [])

  return (
    <Flex>
      <FullHeight>
        <Integrations />
        <Templates />
      </FullHeight>
      {template && <TemplateInfo />}
    </Flex>
  )
}

export default IntegrationPage
