import Check from '@iconify-icons/bi/check'
import PlusCircle from '@iconify-icons/bi/plus-circle'
import timeIcon from '@iconify-icons/bx/bx-time-five'
import { Icon } from '@iconify/react'
import { client } from '@workduck-io/dwindle'
import { shell } from 'electron'
import React, { useEffect, useMemo } from 'react'
import { useTheme } from 'styled-components'
import { integrationURLs } from '../../apis/routes'
import { TemplateInfoBar } from '../../components/layouts/InfoBar'
import { LoadingButton } from '../../components/mex/Buttons/LoadingButton'
import NewSyncTemplateModal, { useNewSyncTemplateModalStore } from '../../components/mex/Integrations/NewSyncBlockModal'
import Template from '../../components/mex/Integrations/Template'
import { Service } from '../../editor/Components/SyncBlock'
import { ServiceIcon } from '../../editor/Components/SyncBlock/SyncIcons'
import useLoad from '../../hooks/useLoad'
import { DateFormat } from '../../hooks/useRelativeTime'
import { useUpdater } from '../../hooks/useUpdater'
import useDataStore from '../../store/useDataStore'
import { useIntegrationStore } from '../../store/useIntegrationStore'
import useOnboard from '../../store/useOnboarding'
import { useSyncStore } from '../../store/useSyncStore'
import {
  ActiveStatus,
  CenteredFlex,
  Flex,
  FullHeight,
  IntegrationContainer,
  Margin,
  PlusIcon,
  PrimaryText,
  RightCut,
  Scroll,
  ServiceCard,
  ServiceName,
  Services,
  StyledIcon,
  TemplateContainer,
  TemplateInfoList,
  TemplateList,
  TemplateSubtitle,
  TemplateTitle,
  Text,
  Title
} from '../../style/Integration'
import { camelCase } from '../../utils/lib/strings'
import { NavigationType, ROUTE_PATHS, useRouting } from '../routes/urls'
// eslint-disable-next-line import/namespace

const NewTemplate = () => {
  const openNewTemplateModal = useNewSyncTemplateModalStore((store) => store.openModal)

  return (
    <>
      <PlusIcon data-tour="create-flow-template" onClick={() => openNewTemplateModal()}>
        <Icon height={64} icon={PlusCircle} />
      </PlusIcon>
      <NewSyncTemplateModal />
    </>
  )
}

const Service = (props: { service: Service }) => {
  const { service } = props
  const connectService = useSyncStore((store) => store.connectService)
  const isOnboarding = useOnboard((s) => s.isOnboarding)

  const onConnectService = (id: string, authUrl: string) => {
    shell.openExternal(authUrl)
    connectService(id)
  }

  const onServiceClick = (ev: any) => {
    ev.preventDefault()
    if (!service.connected && service.enabled && !isOnboarding) onConnectService(service.id, service.authUrl)
  }

  if (service.id === 'MEX') return null

  return (
    <ServiceCard
      data-tour="service-connect"
      onClick={onServiceClick}
      disabled={!service.enabled}
      hover={!service.connected}
    >
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

  // console.log({ services })

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
  const ilinks = useDataStore((store) => store.ilinks)
  const templateDetails = useIntegrationStore((state) => state.templateDetails)
  const isTemplateDetailsLoading = useIntegrationStore((store) => store.isTemplateDetailsLoading)

  const theme = useTheme()
  const { goTo } = useRouting()
  const { getNode, loadNode } = useLoad()

  const onClick = (id: string) => {
    loadNode(id)
    goTo(ROUTE_PATHS.node, NavigationType.push, id)
  }

  const { localNodes, totalCount, deletedNodes, deletedNodesRunCount } = useMemo(() => {
    const localNodes = []
    const deletedNodes = []

    templateDetails?.forEach((info) => {
      const isPresent = ilinks.filter((ilink) => ilink.nodeid === info.node).length === 1
      if (isPresent) localNodes.push(info)
      else deletedNodes.push(info)
    })

    const totalCount = templateDetails?.reduce((total, obj) => obj.runCount + total, 0) ?? 0
    const deletedNodesRunCount = deletedNodes.reduce((total, obj) => obj.runCount + total, 0)

    return {
      localNodes,
      deletedNodes,
      totalCount,
      deletedNodesRunCount
    }
  }, [templateDetails, ilinks])

  return (
    <TemplateInfoBar wide="false">
      <TemplateTitle>Details</TemplateTitle>
      <LoadingButton
        style={{ color: !isTemplateDetailsLoading && theme.colors.text.fade }}
        alsoDisabled
        loading={isTemplateDetailsLoading}
      >{`/flow/${template.command}`}</LoadingButton>
      {templateDetails && (
        <Margin>
          <Text>{`Active count: ${localNodes.length}`}</Text>
          <Text>{`Run: ${totalCount}`}</Text>
        </Margin>
      )}
      <Scroll>
        {localNodes.map((info) => (
          <TemplateInfoList key={'info'} onClick={() => onClick(info.node)}>
            <Text>{getNode(info.node).path}</Text>
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
      </Scroll>
      {deletedNodes.length > 0 && (
        <>
          <TemplateInfoList key={'info'}>
            <TemplateSubtitle>Deleted Nodes</TemplateSubtitle>
            <Text>
              Number of deleted nodes:&nbsp;&nbsp;
              <PrimaryText>{deletedNodes.length}</PrimaryText>
            </Text>
            <Text>
              Run Count:&nbsp;&nbsp;<PrimaryText>{deletedNodesRunCount}</PrimaryText>
            </Text>
          </TemplateInfoList>
        </>
      )}
    </TemplateInfoBar>
  )
}

const Templates = () => {
  const templates = useSyncStore((store) => store.templates)
  const currentTemplate = useIntegrationStore((store) => store.template)
  const selectTemplate = useIntegrationStore((store) => store.selectTemplate)
  const setTemplateDetails = useIntegrationStore((store) => store.setTemplateDetails)
  const setIsTemplateDetailsLoading = useIntegrationStore((store) => store.setIsTemplateDetailsLoading)

  const onSelectTemplate = (template) => {
    selectTemplate(template)
    setIsTemplateDetailsLoading(true)
    client
      .get(integrationURLs.getTemplateDetails(template.id))
      .then((d) => {
        const data = d.data
        if (data) {
          setTemplateDetails(data)
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsTemplateDetailsLoading(false)
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
        {templates
          .filter((template) => template.command !== undefined)
          .map((template) => (
            <Template
              selected={currentTemplate?.id === template.id}
              onClick={onSelectTemplate}
              key={template.id}
              template={template}
            />
          ))}
      </TemplateList>
    </TemplateContainer>
  )
}

const IntegrationPage = () => {
  const { updateServices } = useUpdater()
  const selectTemplate = useIntegrationStore((store) => store.selectTemplate)
  const template = useIntegrationStore((state) => state.template)

  useEffect(() => {
    (async () => {
      await updateServices()
    })()

    return () => selectTemplate(undefined)
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
