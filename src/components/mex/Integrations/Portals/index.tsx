import CreateInput from '@components/spotlight/CreateNodeInput/CreateInput'
import { Icon } from '@iconify/react'
import { mog } from '@utils/lib/helper'
import { shell } from 'electron'
import React, { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useTheme } from 'styled-components'
import { LoadingButton } from '../../Buttons/LoadingButton'
import { GlobalSectionContainer, GlobalSectionHeader } from '../GlobalSection/styled'
import ServiceHeader from '../ServiceHeader'
import ServiceInfo from '../ServiceInfo'
import toast from 'react-hot-toast'
import usePortalStore from './usePortalStore'
import { QuickLink } from '@components/mex/NodeSelect/NodeSelect'
import { useLinks } from '@hooks/useLinks'
import { usePortals } from '@hooks/usePortals'

const Portals = () => {
  const theme = useTheme()
  const params = useParams()
  const location = useLocation()

  const [isEdit, setIsEdit] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [parentNode, setParentNode] = React.useState(undefined)

  const { getPathFromNodeid } = useLinks()
  const { connectToPortal, updateParentNote } = usePortals()

  const apps = usePortalStore((store) => store.apps)
  const getIsPortalConnected = usePortalStore((store) => store.getIsPortalConnected)

  const actionGroup = apps[params.actionGroupId]

  // * Use get service api data
  const isConnected = useMemo(() => getIsPortalConnected(actionGroup.actionGroupId), [params.actionGroupId])
  const parentNoteName = useMemo(() => {
    if (isConnected) return getPathFromNodeid(isConnected?.parentNodeId)

    return undefined
  }, [isConnected])

  const onClick = () => {
    const url = actionGroup?.authConfig?.authURL
    if (url) shell.openExternal(url)
  }

  const onSaveDetails = async () => {
    const query = new URLSearchParams(location.search)
    if (!isEdit) {
      setIsEdit(true)
      return
    }

    if (!parentNode && !isConnected) {
      toast('Select a node first')
      return
    }

    const serviceId = query.get('serviceId')

    try {
      setIsLoading(true)
      const isUpdate = isConnected && isConnected.parentNodeId !== parentNode?.nodeid

      if (isUpdate) {
        updateParentNote(params.actionGroupId, isConnected.serviceId, parentNode.nodeid)
      } else {
        connectToPortal(params.actionGroupId, serviceId, parentNode?.nodeid)
      }
    } catch (err) {
      mog('Error connecting to portal', { err })
    } finally {
      setIsLoading(false)
      setIsEdit(false)
    }
  }

  const onNodeChange = (note: QuickLink) => {
    mog('value is', { note })
    setParentNode(note)
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
        <div>Choose a Parent Note</div>
        <GlobalSectionHeader>
          <CreateInput value={parentNoteName} disabled={!isEdit} onChange={onNodeChange} />
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

export default Portals
