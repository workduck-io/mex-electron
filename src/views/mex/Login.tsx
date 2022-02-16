import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { EMAIL_REG } from '../../data/Defaults/auth'
import { InputFormError } from '../../components/mex/Forms/Input'
import { useAuthentication, useAuthStore } from '../../services/auth/useAuth'
import { BackCard, FooterCard } from '../../style/Card'
import { CenteredColumn } from '../../style/Layouts'
import { Title } from '../../style/Typography'
import { LoadingButton } from '../../components/mex/Buttons/LoadingButton'
import { AuthForm, ButtonFields } from '../../style/Form'
import { mog } from '../../utils/lib/helper'
import { useEditorStore } from '../../store/useEditorStore'
import useDataStore from '../../store/useDataStore'
import useLoad from '../../hooks/useLoad'
import { useUpdater } from '../../hooks/useUpdater'
import { ROUTE_PATHS } from '../routes/urls'

interface LoginFormData {
  email: string
  password: string
}

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>()
  const { login } = useAuthentication()

  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)
  const { loadNode } = useLoad()
  const { updateServices, updateDefaultServices } = useUpdater()
  const onSubmit = async (data: LoginFormData): Promise<void> => {
    await login(data.email, data.password, true)
      .then((s) => {
        mog('Login result', { s })
        if (s.v === 'Incorrect username or password.') {
          toast.error(s.v)
        }
        if (s.v === 'success') {
          const node = useEditorStore.getState().node
          if (node.id === '__null__') {
            mog('Found null, getting node', { node })
            const baseNodeId = useDataStore.getState().baseNodeId
            loadNode(baseNodeId)
          }
          const { userDetails, workspaceDetails } = s.authDetails
          setAuthenticated(userDetails, workspaceDetails)
        }
      })
      .then(updateDefaultServices)
      .then(updateServices)
      .catch((e) => {
        toast.error(e)
      })
  }

  return (
    <CenteredColumn>
      <BackCard>
        <Title>Login</Title>
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          <InputFormError
            name="email"
            label="Email"
            inputProps={{
              autoFocus: true,
              ...register('email', {
                required: true,
                pattern: EMAIL_REG
              })
            }}
            errors={errors}
          ></InputFormError>

          <InputFormError
            name="password"
            label="Password"
            inputProps={{
              type: 'password',
              ...register('password', {
                required: true
              })
            }}
            errors={errors}
          ></InputFormError>

          <ButtonFields>
            <LoadingButton
              loading={isSubmitting}
              alsoDisabled={errors.email !== undefined || errors.password !== undefined}
              buttonProps={{ type: 'submit', primary: true, large: true }}
            >
              Login
            </LoadingButton>
          </ButtonFields>
        </AuthForm>
      </BackCard>
      <FooterCard>
        <Link to={ROUTE_PATHS.register}>Register</Link>
      </FooterCard>
    </CenteredColumn>
  )
}

export default Login
