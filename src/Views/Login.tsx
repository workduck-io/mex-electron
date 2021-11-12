import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { EMAIL_REG } from '../Defaults/auth'
import { InputFormError } from '../Components/Forms/Input'
import { useAuthentication } from '../Hooks/useAuth/useAuth'
import { BackCard, FooterCard } from '../Styled/Card'
import { CenteredColumn } from '../Styled/Layouts'
import { Title } from '../Styled/Typography'
import { LoadingButton } from '../Components/Buttons/LoadingButton'
import { AuthForm } from '../Styled/Form'

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

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    await login(data.email, data.password, true)
      .then((s) => {
        console.log({ s })
        if (s.v === 'Incorrect username or password.') {
          toast.error(s.v)
        }
      })
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

          <br />
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={errors.email !== undefined || errors.password !== undefined}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            Login
          </LoadingButton>
        </AuthForm>
      </BackCard>
      <FooterCard>
        <Link to={'/register'}>Register</Link>
      </FooterCard>
    </CenteredColumn>
  )
}

export default Login
