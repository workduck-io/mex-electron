import React, { useEffect } from 'react'
import { Switch as ReactRouterSwitch, useLocation } from 'react-router-dom'
import { animated } from 'react-spring'
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
import { useEditorBuffer } from '../../hooks/useEditorBuffer'
import { useAuthStore } from '../../services/auth/useAuth'

const SwitchWrapper = styled(animated.div)<{ isAuth?: boolean }>`
  position: fixed;
  width: ${({ theme, isAuth }) => (!isAuth ? '100%' : `calc(100% - ${theme.width.nav}px)`)};
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`

const Switch = () => {
  const location = useLocation()
  // const { saveQ } = useSaveQ()
  const { saveAndClearBuffer } = useEditorBuffer()
  const authenticated = useAuthStore((s) => s.authenticated)
  // const Perspective = '2000px'
  // const transitions = useTransition(location, {
  //   from: {
  //     opacity: 0,
  //     transform: `scale(0.75) perspective(${Perspective}) rotateX(20deg) translate(-15%, -15%)`
  //   },
  //   enter: {
  //     opacity: 1,
  //     transform: `scale(1.0) perspective(${Perspective}) rotateX(0deg) translate(0%, 0%)`
  //   },
  //   leave: {
  //     opacity: 0,
  //     transform: `scale(0.75) perspective(${Perspective}) rotateX(-20deg) translate(15%, 15%)`
  //   },
  //   delay: 0,
  //   config: config.default
  // })

  useEffect(() => {
    // console.error({ q })
    // if (q.length > 0) {
    saveAndClearBuffer()

    // }
  }, [location])

  // return transitions((props, item) => (
  return (
    <SwitchWrapper isAuth={authenticated}>
      {/* <ReactRouterSwitch location={item}> */}
      <ReactRouterSwitch>
        <ProtectedRoute path="/editor" component={EditorView} />
        <ProtectedRoute path="/tasks" component={Tasks} />
        <ProtectedRoute path="/integrations" component={Integrations} />
        <ProtectedRoute exact path="/snippets" component={Snippets} />
        <ProtectedRoute exact path="/snippets/editor" component={SnippetEditor} />
        <ProtectedRoute path="/settings" component={Settings} />
        <ProtectedRoute path="/search" component={Search} />
        <ProtectedRoute path="/tag/:tag" component={Tag} />
        <ProtectedRoute path="/" exact component={Dashboard} />
        <ProtectedRoute path="/archive" exact component={Archive} />
        <AuthRoute path="/login" component={Login} />
        <AuthRoute path="/register" component={Register} />
      </ReactRouterSwitch>
    </SwitchWrapper>
  )
}

export default Switch
