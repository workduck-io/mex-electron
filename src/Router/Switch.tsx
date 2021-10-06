import React from 'react'
import { Switch as ReactRouterSwitch, useLocation } from 'react-router-dom'
import { animated, config, useTransition } from 'react-spring'
import styled from 'styled-components'
import SnippetEditor from '../Snippets/SnippetEditor'
import Dashboard from '../Views/Dashboard'
import EditorView from '../Views/EditorView'
import Integrations from '../Views/Integrations'
import Login from '../Views/Login'
import Register from '../Views/Register'
import Settings from '../Views/Settings'
import Snippets from '../Views/Snippets'
import Tasks from '../Views/Tasks'
import AuthRoute from './AuthRoute'
import ProtectedRoute from './ProtectedRoute'

const SwitchWrapper = styled(animated.div)`
  position: fixed;
  width: ${({ theme }) => `calc(100% - ${theme.width.nav}px)`};
  height: 100%;
`

const Switch = () => {
  const location = useLocation()
  const transitions = useTransition(location, {
    from: {
      opacity: 0,
      transform: 'scale(0.75) perspective(2000px) rotateX(20deg) translate(-15%, -15%)'
    },
    enter: {
      opacity: 1,
      transform: 'scale(1.0) perspective(2000px) rotateX(0deg) translate(0%, 0%)'
    },
    leave: {
      opacity: 0,
      transform: 'scale(0.75) perspective(2000px) rotateX(-20deg) translate(15%, 15%)'
    },
    delay: 0,
    config: config.gentle
  })
  return transitions((props, item) => (
    <SwitchWrapper style={props}>
      <ReactRouterSwitch location={item}>
        <ProtectedRoute path="/editor" component={EditorView} />
        <ProtectedRoute path="/tasks" component={Tasks} />
        <ProtectedRoute path="/integrations" component={Integrations} />
        <ProtectedRoute exact path="/snippets" component={Snippets} />
        <ProtectedRoute exact path="/snippets/editor" component={SnippetEditor} />
        <ProtectedRoute path="/settings" component={Settings} />
        <ProtectedRoute path="/" exact component={Dashboard} />
        <AuthRoute path="/register" component={Register} />
        <AuthRoute path="/login" component={Login} />
      </ReactRouterSwitch>
    </SwitchWrapper>
  ))
}

export default Switch
