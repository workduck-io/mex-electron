import React from 'react'

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

import { StyledTopNavigation } from './styled'

type NavBreadCrumbsType = {
  nodeId: string
}

const NavBreadCrumbs = ({ nodeId }: NavBreadCrumbsType) => {
  const { goTo } = useRouting()
  const { getNodeBreadcrumbs } = useNodes()
  const { getNamespaceIconForNode } = useNamespaces()
  const isUserEditing = useEditorStore((store) => store.isEditing)

  const openBreadcrumb = (nodeId: string) => {
    if (nodeId.startsWith(NAMESPACE_ID_PREFIX)) return
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeId)
  }

  const namespaceIcon = getNamespaceIconForNode(nodeId)

  return (
    <StyledTopNavigation>
      <EditorBreadcrumbs isVisible={!isUserEditing}>
        {namespaceIcon && (
          <>
            <IconDisplay icon={namespaceIcon} />
            <Icon icon="ri:arrow-drop-right-line" fontSize="1.5rem" />
          </>
        )}
        <Breadcrumbs items={getNodeBreadcrumbs(nodeId)} key={`mex-breadcrumbs-${nodeId}`} onOpenItem={openBreadcrumb} />
      </EditorBreadcrumbs>
    </StyledTopNavigation>
  )
}

export default NavBreadCrumbs
