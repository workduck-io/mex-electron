import React, { useEffect } from 'react'
import { Outlet, Route, Routes, useLocation, useMatch } from 'react-router-dom'
import styled from 'styled-components'
import Search from '../../components/mex/Search/Search'
import SnippetEditor from '../../components/Snippets/SnippetEditor'
import Archive from '../mex/Archive'
import Dashboard from '../mex/Dashboard'
import EditorView from '../mex/EditorView'
import Integrations from '../mex/Integration'
import Login from '../mex/Login'
import Register from '../mex/Register'
import Settings from '../mex/Settings'
import Snippets from '../mex/Snippets'
import Tag from '../mex/Tag'
import Tasks from '../mex/Tasks'
import AuthRoute from './AuthRoute'
import ProtectedRoute from './ProtectedRoute'
import Themes from '../../components/mex/Settings/Themes'
import About from '../../components/mex/Settings/About'
import AutoUpdate from '../../components/mex/Settings/AutoUpdate'
import Importers from '../../components/mex/Settings/Importers'
import { useEditorBuffer } from '../../hooks/useEditorBuffer'
import { useAuthStore } from '../../services/auth/useAuth'
import { ROUTE_PATHS } from '../routes/urls'
import UserPage from '../mex/UserPage'
import Shortcuts from '../../components/mex/Settings/Shortcuts'
import ContentEditor from '../../editor/ContentEditor'
import { mog } from '../../utils/lib/helper'
import NotFound from '../NotFound'
import useBlockStore from '../../store/useBlockStore'
import useInfoBarStore from '../../store/useInfoBarStore'

export const SwitchWrapper = styled.div<{ isAuth?: boolean }>`
  position: fixed;
  width: ${({ theme, isAuth }) => (!isAuth ? '100%' : `calc(100% - ${theme.width.nav}px)`)};
  height: 100%;
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
  const isBlockMode = useInfoBarStore((store) => store.showBlockView)
  const setIsBlockMode = useInfoBarStore((store) => store.setBlockView)

  const { saveAndClearBuffer } = useEditorBuffer()
  const authenticated = useAuthStore((s) => s.authenticated)
  useEffect(() => {
    // ? Do we need to save data locally on every route change?
    if (authenticated) {
      if (isBlockMode) setIsBlockMode(false)
      saveAndClearBuffer()
    }
  }, [location])

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
    <SwitchWrapper isAuth={authenticated}>
      <Routes>
        <Route path={ROUTE_PATHS.login} element={<AuthRoute component={Login} />} />
        <Route path={ROUTE_PATHS.register} element={<AuthRoute component={Register} />} />

        <Route path={ROUTE_PATHS.home} element={<Home />}>
          <Route index element={<ProtectedRoute component={Dashboard} />} />
          {/*<Route path={ROUTE_PATHS.integrations} element={<ProtectedRoute component={Integrations} />} />*/}
          <Route path={ROUTE_PATHS.archive} element={<ProtectedRoute component={Archive} />} />
          <Route path={ROUTE_PATHS.snippets} element={<ProtectedRoute component={Snippets} />} />
          <Route path={ROUTE_PATHS.search} element={<ProtectedRoute component={Search} />} />
          <Route path={ROUTE_PATHS.tasks} element={<ProtectedRoute component={Tasks} />} />

          {/* Dynamic routes */}
          <Route path={`${ROUTE_PATHS.snippet}/:snippetid`} element={<ProtectedRoute component={SnippetEditor} />} />
          <Route path={ROUTE_PATHS.settings} element={<ProtectedRoute component={Settings} />}>
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
