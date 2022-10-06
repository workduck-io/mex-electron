import ArchiveNoteEditor from '@components/mex/Archive/ArchiveNoteEditor'
import Actions from '@components/mex/Integrations/Actions'
import CalendarIntegrations from '@components/mex/Integrations/Calendar'
import Portals from '@components/mex/Integrations/Portals'
import { useEditorBuffer, useSnippetBuffer } from '@hooks/useEditorBuffer'
import { useSaveNodeName } from '@hooks/useSaveNodeName'
import useBlockStore from '@store/useBlockStore'
import { useEditorStore } from '@store/useEditorStore'
import { useLayoutStore } from '@store/useLayoutStore'
import { OverlaySidebarWindowWidth } from '@style/responsive'
import { mog } from '@utils/lib/helper'
import React, { useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { matchPath, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { animated } from 'react-spring'
import styled from 'styled-components'
import Search from '../../components/mex/Search/Search'
import About from '../../components/mex/Settings/About'
import AutoUpdate from '../../components/mex/Settings/AutoUpdate'
import Importers from '../../components/mex/Settings/Importers'
import Shortcuts from '../../components/mex/Settings/Shortcuts'
import Themes from '../../components/mex/Settings/Themes'
import SnippetEditor from '../../components/Snippets/SnippetEditor'
import ContentEditor from '../../editor/ContentEditor'
import { useAuthStore } from '../../services/auth/useAuth'
import ActionGroupsPage from '../mex/Actions'
import Archive from '../mex/Archive'
import Dashboard from '../mex/Dashboard'
import EditorView from '../mex/EditorView'
import ForgotPassword from '../mex/ForgotPassword'
import Login from '../mex/Login'
import Register from '../mex/Register'
import RemindersAll from '../mex/Reminders/RemindersAll'
import Settings from '../mex/Settings'
import Snippets from '../mex/Snippets'
import Tag from '../mex/Tag'
import Tasks from '../mex/Tasks'
import UserPage from '../mex/UserPage'
import NotFound from '../NotFound'
import { ROUTE_PATHS } from '../routes/urls'
import AuthRoute from './AuthRoute'
import ProtectedRoute from './ProtectedRoute'

export const SwitchWrapper = styled(animated.div)<{ $isAuth?: boolean }>`
  height: 100%;

  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`

const Home = () => (
  <>
    <Outlet />
  </>
)

const Switch = () => {
  const location = useLocation()
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)

  const { saveAndClearBuffer: saveEditorBuffer } = useEditorBuffer()
  const { saveAndClearBuffer: saveSnippetBuffer } = useSnippetBuffer()
  const authenticated = useAuthStore((s) => s.authenticated)
  const { saveNodeName } = useSaveNodeName()
  const showSidebar = useLayoutStore((s) => s.showSidebar)
  const showAllSidebars = useLayoutStore((s) => s.showAllSidebars)
  const hideAllSidebars = useLayoutStore((s) => s.hideAllSidebars)
  const hideSidebar = useLayoutStore((s) => s.hideSidebar)
  const collapseAllSidebars = useLayoutStore((s) => s.collapseAllSidebars)
  const hideRHSidebar = useLayoutStore((s) => s.hideRHSidebar)

  const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })

  useEffect(() => {
    const editorNode = useEditorStore.getState().node
    // ? Do we need to save data locally on every route change?
    // mog('Changing location', { location })
    if (authenticated) {
      if (isBlockMode) setIsBlockMode(false)
      if (editorNode) saveNodeName(editorNode.nodeid)
      saveEditorBuffer()
      mog('Saving editor buffer onLocationChange')
      saveSnippetBuffer()
    }

    if (location.pathname) {
      if (location.pathname.startsWith(ROUTE_PATHS.snippets)) {
        // mog('Showing Sidebar', { location })
        showSidebar()
        hideRHSidebar()
      } else if (location.pathname.startsWith(ROUTE_PATHS.node)) {
        showAllSidebars()
      } else if (location.pathname.startsWith(ROUTE_PATHS.archive)) {
        showSidebar()
        hideRHSidebar()
      } else if (location.pathname.startsWith(ROUTE_PATHS.tag)) {
        showSidebar()
        hideRHSidebar()
      } else if (location.pathname.startsWith(ROUTE_PATHS.tasks)) {
        showSidebar()
        hideRHSidebar()
      } else {
        mog('Hiding all Sidebar', { location })
        hideAllSidebars()
      }
    }
  }, [location])

  useEffect(() => {
    if (overlaySidebar) {
      collapseAllSidebars()
    }
  }, [overlaySidebar])

  /* Hierarchy:
    - login
    - register
    - home (layout with navbar)
      - settings (layout with settings sidebar)
        - profile
        - auto updates
        - about
        - theme
        - import
      - snippets
      - snippet
      - tags
      - node (layout with tree, editor and sidebar)
        - editor
  */

  return (
    <SwitchWrapper $isAuth={authenticated}>
      <Routes>
        <Route path={ROUTE_PATHS.login} element={<AuthRoute component={Login} />} />
        <Route path={ROUTE_PATHS.register} element={<AuthRoute component={Register} />} />
        <Route path={ROUTE_PATHS.forgotpassword} element={<AuthRoute component={ForgotPassword} />} />

        <Route path={ROUTE_PATHS.home} element={<Home />}>
          <Route index element={<ProtectedRoute component={Dashboard} />} />
          <Route path={ROUTE_PATHS.integrations} element={<ProtectedRoute component={ActionGroupsPage} />} />
          <Route path={`${ROUTE_PATHS.integrations}/:actionGroupId`} element={<ProtectedRoute component={Actions} />} />
          <Route
            path={`${ROUTE_PATHS.integrations}/portal/:actionGroupId`}
            element={<ProtectedRoute component={Portals} />}
          />
          <Route
            path={`${ROUTE_PATHS.integrations}/calendar/:actionGroupId`}
            element={<ProtectedRoute component={CalendarIntegrations} />}
          />
          <Route path={ROUTE_PATHS.archive} element={<ProtectedRoute component={Archive} />} />
          <Route path={`${ROUTE_PATHS.archive}/:nodeid`} element={<ProtectedRoute component={ArchiveNoteEditor} />} />

          <Route path={ROUTE_PATHS.snippets} element={<ProtectedRoute component={Snippets} />} />
          <Route path={ROUTE_PATHS.search} element={<ProtectedRoute component={Search} />} />
          <Route path={ROUTE_PATHS.tasks} element={<ProtectedRoute component={Tasks} />} />
          <Route path={`${ROUTE_PATHS.tasks}/:viewid`} element={<ProtectedRoute component={Tasks} />} />
          <Route path={ROUTE_PATHS.reminders} element={<ProtectedRoute component={RemindersAll} />} />

          <Route path={`${ROUTE_PATHS.snippet}/:snippetid`} element={<ProtectedRoute component={SnippetEditor} />} />
          <Route path={ROUTE_PATHS.settings} element={<ProtectedRoute component={Settings} />}>
            <Route index element={<ProtectedRoute component={UserPage} />} />
            <Route path="themes" element={<ProtectedRoute component={Themes} />} />
            <Route path="user" element={<ProtectedRoute component={UserPage} />} />
            <Route path="shortcuts" element={<ProtectedRoute component={Shortcuts} />} />
            <Route path="about" element={<ProtectedRoute component={About} />} />
            <Route path="autoupdate" element={<ProtectedRoute component={AutoUpdate} />} />
            <Route path="import" element={<ProtectedRoute component={Importers} />} />
          </Route>
          <Route path={ROUTE_PATHS.node} element={<ProtectedRoute component={EditorView} />}>
            <Route path=":nodeid" element={<ProtectedRoute component={ContentEditor} />} />
          </Route>
          <Route path={`${ROUTE_PATHS.tag}/:tag`} element={<ProtectedRoute component={Tag} />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SwitchWrapper>
  )
}

export default Switch
