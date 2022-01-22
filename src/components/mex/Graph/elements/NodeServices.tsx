import React from 'react'
import { useGraphStore } from '../../../../store/useGraphStore'
import { ServiceIcon } from '../../../../editor/Components/SyncBlock/SyncIcons'
import { NodeServiceContainer, ServiceIconMargin } from '../styled/NodeService.styled'

const NodeServices = () => {
  const addServiceNode = useGraphStore((store) => store.addServiceNode)

  const onServiceClick = () => {
    addServiceNode({ name: 'Slack' })
  }

  return (
    <NodeServiceContainer>
      <ServiceIconMargin onClick={onServiceClick}>
        <ServiceIcon service={'GITHUB'} height="32px" width="32px" />
      </ServiceIconMargin>
      <ServiceIconMargin onClick={onServiceClick}>
        <ServiceIcon service={'SLACK'} height="32px" width="32px" />
      </ServiceIconMargin>
    </NodeServiceContainer>
  )
}

export default NodeServices
