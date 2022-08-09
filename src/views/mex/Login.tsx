import { LoadingButton } from '@workduck-io/mex-components'
import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { GoogleLoginButton } from '../../components/mex/Buttons/LoadingButton'
import { InputFormError } from '../../components/mex/Forms/Input'
import { EMAIL_REG } from '../../data/Defaults/auth'
import { useAuthentication, useAuthStore } from '../../services/auth/useAuth'
import { BackCard, FooterCard } from '../../style/Card'
import { AuthForm, ButtonFields } from '../../style/Form'
import { CenteredColumn } from '../../style/Layouts'
import { Title } from '../../style/Typography'
import { mog } from '../../utils/lib/helper'
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

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    await login(data.email, data.password, true)
      .then((s) => {
        mog('Login result', { s })
        if (s.v === 'Incorrect username or password.') {
          toast.error(s.v)
        }

        if (s.v === 'success') {
          const { userDetails, workspaceDetails } = s.authDetails
          // const node = useEditorStore.getState().node

          // if (node?.nodeid === '__null__') {
          //   const baseNode = updateBaseNode()
          //   loadNode(baseNode?.nodeid, { savePrev: false, fetch: false })
          //   goTo(ROUTE_PATHS.node, NavigationType.push, baseNode?.nodeid)
          // }

          setAuthenticated(userDetails, workspaceDetails)
        }
      })
      .catch((e) => {
        mog('ERROR OCCURED', { e })
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
              type="submit"
              primary
              large
            >
              Login
            </LoadingButton>
          </ButtonFields>
        </AuthForm>
        <ButtonFields>
          <GoogleLoginButton text={'Login via Google'} />
        </ButtonFields>
      </BackCard>
      <FooterCard>
        <Link to={ROUTE_PATHS.forgotpassword}>Forgot Password?</Link>
      </FooterCard>
      <FooterCard>
        <Link to={ROUTE_PATHS.register}>Register</Link>
      </FooterCard>
    </CenteredColumn>
  )
}

export default Login
