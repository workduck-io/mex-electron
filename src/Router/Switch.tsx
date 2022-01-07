import React, { useEffect } from 'react'
import { Switch as ReactRouterSwitch, useLocation } from 'react-router-dom'
import { animated } from 'react-spring'
import { useInitOlvy } from '../Olvy'
import styled from 'styled-components'
import Search from '../Components/Search/Search'
import { useQStore, useSaveQ } from '../Hooks/useQ'
import SnippetEditor from '../Snippets/SnippetEditor'
import Archive from '../Views/Archive'
import Dashboard from '../Views/Dashboard'
import EditorView from '../Views/EditorView'
import Integrations from '../Views/Integration'
import Login from '../Views/Login'
import Register from '../Views/Register'
import Settings from '../Views/Settings'
import Snippets from '../Views/Snippets'
import Tag from '../Views/Tag'
import Tasks from '../Views/Tasks'
import UserPage from '../Views/UserPage'
import AuthRoute from './AuthRoute'
import ProtectedRoute from './ProtectedRoute'

const SwitchWrapper = styled(animated.div)`
  position: fixed;
  width: ${({ theme }) => `calc(100% - ${theme.width.nav}px)`};
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`

const Switch = () => {
  const location = useLocation()
  const q = useQStore((s) => s.q)
  const { saveQ } = useSaveQ()
  useInitOlvy()
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
    if (q.length > 0) {
      saveQ()
    }
  }, [location])

  // return transitions((props, item) => (
  return (
    // <SwitchWrapper style={props}>
    <SwitchWrapper>
      {/* <ReactRouterSwitch location={item}> */}
      <ReactRouterSwitch>
        <ProtectedRoute path="/editor" component={EditorView} />
        <ProtectedRoute path="/tasks" component={Tasks} />
        <ProtectedRoute path="/integrations" component={Integrations} />
        <ProtectedRoute exact path="/snippets" component={Snippets} />
        <ProtectedRoute exact path="/snippets/editor" component={SnippetEditor} />
        <ProtectedRoute path="/user" component={UserPage} />
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
