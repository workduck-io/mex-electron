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

const SwitchWrapper = styled.div<{ isAuth?: boolean }>`
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
  const { saveAndClearBuffer } = useEditorBuffer()
  const authenticated = useAuthStore((s) => s.authenticated)

  useEffect(() => {
    // ? Do we need to save data locally on every route change?
    saveAndClearBuffer()
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
      - node (layout with tree, editor and sidebar)
        - editor
  */

  return (
    <SwitchWrapper isAuth={authenticated}>
      <Routes>
        <Route path={ROUTE_PATHS.login} element={<AuthRoute component={Login} />} />
        <Route path={ROUTE_PATHS.register} element={<AuthRoute component={Register} />} />

        {/* Home */}
        <Route path={ROUTE_PATHS.home} element={<Home />}>
          <Route index element={<ProtectedRoute component={Dashboard} />} />
          <Route path={ROUTE_PATHS.integrations} element={<Integrations />} />
          <Route path={ROUTE_PATHS.archive} element={<Archive />} />
          <Route path={ROUTE_PATHS.snippets} element={<Snippets />} />
          <Route path={ROUTE_PATHS.search} element={<Search />} />
          <Route path={ROUTE_PATHS.tasks} element={<Tasks />} />

          {/* Dynamic routes */}
          <Route path={`${ROUTE_PATHS.snippet}/:snippetid`} element={<SnippetEditor />} />
          <Route path={ROUTE_PATHS.settings} element={<Settings />}>
            <Route path="themes" element={<Themes />} />
            <Route path="user" element={<UserPage />} />
            <Route path="shortcuts" element={<Shortcuts />} />
            <Route path="about" element={<About />} />
            <Route path="autoupdate" element={<AutoUpdate />} />
            <Route path="import" element={<Importers />} />
          </Route>
          <Route path={ROUTE_PATHS.node} element={<EditorView />}>
            <Route path=":nodeid" element={<ContentEditor />} />
          </Route>

          {/* <Route path={ROUTE_PATHS.tasks} element={<ProtectedRoute component={Tasks} />} />
          <Route path={ROUTE_PATHS.search} element={<ProtectedRoute component={Search} />} />
          <Route path={ROUTE_PATHS.settings} element={<ProtectedRoute component={Settings} />} />
          <Route path={ROUTE_PATHS.archive} element={<ProtectedRoute component={Archive} />} />
          <Route path={ROUTE_PATHS.snippets} element={<ProtectedRoute component={Snippets} />} />
          <Route path={ROUTE_PATHS.dashborad} element={<ProtectedRoute component={Dashboard} />} />
          <Route path={ROUTE_PATHS.integrations} element={<ProtectedRoute component={Integrations} />} />

          <Route path={`${ROUTE_PATHS.tag}/:tag`} element={<ProtectedRoute component={Tag} />} />
          <Route path={`${ROUTE_PATHS.node}/:nodeid`} element={<ProtectedRoute component={EditorView} />} />
          <Route path={`${ROUTE_PATHS}/:snippetid`} element={<ProtectedRoute component={SnippetEditor} />} /> */}
        </Route>

        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There&apos;s nothing here!</p>
            </main>
          }
        />
      </Routes>
    </SwitchWrapper>
  )
}

export default Switch
