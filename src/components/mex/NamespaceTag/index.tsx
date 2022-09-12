import { SingleNamespace } from '../../../types/Types'
import React from 'React'
import { RESERVED_NAMESPACES } from '@utils/lib/paths'
import { MexIcon } from '@workduck-io/mex-components'
import { useTheme } from 'styled-components'
import { StyledNamespaceTag } from './styled'

type NamespaceTag = {
  namespace: SingleNamespace
  separator?: boolean
}

const NamespaceTag = ({ namespace, separator = false }: NamespaceTag) => {
  const theme = useTheme()

  if (!namespace) return <></>

  const icon = namespace?.icon ?? namespace.name === RESERVED_NAMESPACES.default ? 'ri:user-line' : 'heroicons-outline:view-grid'

  return <StyledNamespaceTag separator={separator}>
    <MexIcon icon={icon} width={12} height={12} color={theme.colors.primary} margin="0 0.1rem 0 0" />
    {namespace.name}
  </StyledNamespaceTag>

}

export default NamespaceTag
