import { useNodes } from '@hooks/useNodes'
import { useEditorStore } from '@store/useEditorStore'
import { EditorBreadcrumbs } from '@style/Editor'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { Breadcrumbs } from '@workduck-io/mex-components'
import React from 'react'
import { StyledTopNavigation } from './styled'

type NavBreadCrumbsType = {
  nodeId: string
}

const NavBreadCrumbs = ({ nodeId }: NavBreadCrumbsType) => {
  const { goTo } = useRouting()
  const { getNodeBreadcrumbs } = useNodes()
  const isUserEditing = useEditorStore((store) => store.isEditing)

  const openBreadcrumb = (nodeId: string) => {
    goTo(ROUTE_PATHS.node, NavigationType.push, nodeId)
  }

  return (
    <StyledTopNavigation>
      <EditorBreadcrumbs isVisible={!isUserEditing}>
        <Breadcrumbs items={getNodeBreadcrumbs(nodeId)} key={`mex-breadcrumbs-${nodeId}`} onOpenItem={openBreadcrumb} />
      </EditorBreadcrumbs>
    </StyledTopNavigation>
  )
}

export default NavBreadCrumbs
