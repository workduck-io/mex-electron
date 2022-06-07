import CreateInput from '@components/spotlight/CreateNodeInput/CreateInput'
import { Icon } from '@iconify/react'
import { mog } from '@utils/lib/helper'
import { botMap } from '@views/mex/Actions'
import { shell } from 'electron'
import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useTheme } from 'styled-components'
import { LoadingButton } from '../Buttons/LoadingButton'
import { GlobalSectionContainer, GlobalSectionHeader } from './GlobalSection/styled'
import ServiceHeader from './ServiceHeader'
import ServiceInfo from './ServiceInfo'
import { client } from '@workduck-io/dwindle'
import { useAuthStore } from '@services/auth/useAuth'
import toast from 'react-hot-toast'
import { QuickLink } from '../NodeSelect/NodeSelect'

const Bots = () => {
  const params = useParams()
  const theme = useTheme()
  const location = useLocation()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isEdit, setIsEdit] = React.useState(false)

  const [parentNode, setParentNode] = React.useState<QuickLink>(undefined)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  // * Use get service api data
  const actionGroup = botMap[params.actionGroupId]
  const isConnected = actionGroup?.connected

  const onClick = () => {
    const url = actionGroup?.authConfig?.authURL
    if (url) shell.openExternal(url)
  }

  const onSaveDetails = async () => {
    const query = new URLSearchParams(location.search)

    if (!parentNode) {
      toast('Select a node first')
      return
    }

    const reqData = {
      serviceId: query.get('serviceId'),
      serviceType: params.actionGroupId,
      mexId: getWorkspaceId(),
      parentNodeId: parentNode?.nodeid
    }

    setIsLoading(true)

    const data = await client
      .post(`https://itchy.loca.lt/connect/${reqData.mexId}`, reqData, {
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        setIsLoading(false)
      })

    mog('DATA IS HERE', { data })
  }

  const onNodeChange = (val) => {
    mog('value is', { val })
    setParentNode(val)
  }

  return (
    <ServiceInfo>
      <ServiceHeader
        description={actionGroup.description}
        icon={actionGroup.icon}
        isConnected={isConnected}
        title={actionGroup.name}
        onClick={onClick}
      />
      <GlobalSectionContainer>
        <div>Connect with</div>
        <GlobalSectionHeader>
          <CreateInput onChange={onNodeChange} />
        </GlobalSectionHeader>
        <LoadingButton dots={2} loading={isLoading} buttonProps={{ onClick: onSaveDetails, transparent: true }}>
          <Icon
            color={theme.colors.primary}
            width={20}
            icon={isEdit ? 'teenyicons:tick-circle-solid' : 'clarity:note-edit-solid'}
          />
        </LoadingButton>
      </GlobalSectionContainer>
    </ServiceInfo>
  )
}

export default Bots
