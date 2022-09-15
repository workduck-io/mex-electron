import { NAMESPACE_ID_PREFIX } from '@data/Defaults/idPrefixes'
import { useNamespaces } from '@hooks/useNamespaces'
import { useNodes } from '@hooks/useNodes'
import { Icon } from '@iconify/react'
import { useEditorStore } from '@store/useEditorStore'
import { EditorBreadcrumbs } from '@style/Editor'
import IconDisplay from '@ui/components/IconPicker/IconDisplay'
import { RESERVED_NAMESPACES } from '@utils/lib/paths'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { Breadcrumbs } from '@workduck-io/mex-components'
import { mog } from '@workduck-io/mex-utils'
import React from 'react'
import { StyledTopNavigation } from './styled'

type NavBreadCrumbsType = {
  nodeId: string
}

const NavBreadCrumbs = ({ nodeId }: NavBreadCrumbsType) => {
  const { goTo } = useRouting()
  const { getNodeBreadcrumbs } = useNodes()
  const { getNamespaceOfNode } = useNamespaces()
  const isUserEditing = useEditorStore((store) => store.isEditing)

  const openBreadcrumb = (nodeId: string) => {
    if (nodeId.startsWith(NAMESPACE_ID_PREFIX)) return
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeId)
  }

  const namespace = getNamespaceOfNode(nodeId)

  const icon = namespace.icon ?? {
    type: 'ICON',
    value:
      namespace.name === RESERVED_NAMESPACES.default
        ? 'ri:user-line'
        : namespace.name === RESERVED_NAMESPACES.shared
        ? 'ri:share-line'
        : 'heroicons-outline:view-grid'
  }

  return (
    <StyledTopNavigation>
      <EditorBreadcrumbs isVisible={!isUserEditing}>
        {icon && (
          <>
            <IconDisplay icon={icon} />
            <Icon icon="ri:arrow-drop-right-line" fontSize="1.5rem" />
          </>
        )}
        <Breadcrumbs items={getNodeBreadcrumbs(nodeId)} key={`mex-breadcrumbs-${nodeId}`} onOpenItem={openBreadcrumb} />
      </EditorBreadcrumbs>
    </StyledTopNavigation>
  )
}

export default NavBreadCrumbs
