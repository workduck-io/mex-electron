import React, { useMemo } from 'react'

import { QuickLink } from '@components/mex/NodeSelect/NodeSelect'
import CreateInput from '@components/spotlight/CreateNodeInput/CreateInput'
import { useLinks } from '@hooks/useLinks'
import { usePortals } from '@hooks/usePortals'
import { Icon } from '@iconify/react'
import { mog } from '@utils/lib/mog'
import { shell } from 'electron'
import toast from 'react-hot-toast'
import { useLocation, useParams } from 'react-router-dom'
import { useTheme } from 'styled-components'

import { LoadingButton } from '@workduck-io/mex-components'

import { GlobalSectionContainer, GlobalSectionHeader } from '../GlobalSection/styled'
import ServiceHeader from '../ServiceHeader'
import ServiceInfo from '../ServiceInfo'
import usePortalStore from './usePortalStore'

const Portals = () => {
  const theme = useTheme()
  const params = useParams()
  const location = useLocation()

  const query = new URLSearchParams(location.search)
  const serviceId = query.get('serviceId')

  const [isEdit, setIsEdit] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [parentNote, setParentNote] = React.useState<QuickLink>(undefined)

  const { getILinkFromNodeid } = useLinks()
  const { connectToPortal, updateParentNote } = usePortals()

  const apps = usePortalStore((store) => store.apps)
  const connectedPortals = usePortalStore((store) => store.connectedPortals)
  const getIsPortalConnected = usePortalStore((store) => store.getIsPortalConnected)

  const actionGroup = apps[params.actionGroupId]

  const { connectedPortalInfo, parentNoteName, parentNamespace } = useMemo(() => {
    const connectedPortalInfo = getIsPortalConnected(actionGroup.actionGroupId)

    let parentNoteName = ''
    let parentNamespace = ''
    if (connectedPortalInfo) {
      const node = getILinkFromNodeid(connectedPortalInfo?.parentNodeId)
      parentNoteName = node?.path
      parentNamespace = node?.namespace
    }

    return {
      parentNoteName,
      connectedPortalInfo,
      parentNamespace
    }
  }, [params.actionGroupId, connectedPortals])

  const isNewPortal = serviceId && !connectedPortalInfo

  const onClick = () => {
    const url = actionGroup?.authConfig?.authURL
    if (url) shell.openExternal(url)
  }

  const onSaveDetails = async () => {
    if (!isEdit && !isNewPortal) {
      setIsEdit(true)
      return
    }

    if (!parentNote && !connectedPortalInfo) {
      toast('Select a Note first')
      return
    }

    try {
      setIsLoading(true)
      const isUpdate = connectedPortalInfo && connectedPortalInfo.parentNodeId !== parentNote?.nodeid

      if (isUpdate) {
        await updateParentNote(params.actionGroupId, connectedPortalInfo.serviceId, parentNote.nodeid)
      } else {
        await connectToPortal(params.actionGroupId, serviceId, parentNote?.nodeid)
      }

      toast(`Updated Successfully! All new notes will be added under "${parentNote?.text || 'this Note'}"`)
    } catch (err) {
      mog('Error connecting to portal', { err })
    } finally {
      setIsLoading(false)
      setIsEdit(false)
    }
  }

  const onNodeChange = (note: QuickLink) => {
    setParentNote(note)
  }

  return (
    <ServiceInfo>
      <ServiceHeader
        description={actionGroup.description}
        icon={actionGroup.icon}
        isConnected={!!connectedPortalInfo}
        title={actionGroup.name}
        onClick={onClick}
      />
      {(isNewPortal || connectedPortalInfo) && (
        <GlobalSectionContainer>
          <div>Select a Parent Note</div>
          <GlobalSectionHeader>
            <CreateInput
              value={
                parentNoteName
                  ? {
                      path: parentNoteName,
                      namespace: parentNamespace
                    }
                  : undefined
              }
              autoFocus={isNewPortal || isEdit}
              disabled={!isNewPortal && !isEdit}
              onChange={onNodeChange}
            />
          </GlobalSectionHeader>
          <LoadingButton dots={2} loading={isLoading} onClick={onSaveDetails} transparent>
            <Icon
              color={theme.colors.primary}
              width={24}
              icon={isEdit || isNewPortal ? 'teenyicons:tick-circle-outline' : 'clarity:note-edit-line'}
            />
          </LoadingButton>
        </GlobalSectionContainer>
      )}
    </ServiceInfo>
  )
}

export default Portals
