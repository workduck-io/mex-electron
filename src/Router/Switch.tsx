import React from 'react'
import { Switch as ReactRouterSwitch } from 'react-router-dom'
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

const Switch = () => {
  return (
    <ReactRouterSwitch>
      <ProtectedRoute path="/editor" component={EditorView} />
      <ProtectedRoute path="/tasks" component={Tasks} />
      <ProtectedRoute path="/integrations" component={Integrations} />
      <ProtectedRoute exact path="/snippets" component={Snippets} />
      <ProtectedRoute exact path="/snippets/editor" component={SnippetEditor} />
      <ProtectedRoute path="/settings" component={Settings} />
      <ProtectedRoute path="/" exact component={Dashboard} />
      <AuthRoute path="/login" component={Login} />
      <AuthRoute path="/register" component={Register} />
    </ReactRouterSwitch>
  )
}

export default Switch
