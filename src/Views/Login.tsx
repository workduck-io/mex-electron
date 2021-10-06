import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from '../Components/Forms/Input'
import { useAuthentication } from '../Hooks/useAuth/useAuth'
import { Button } from '../Styled/Buttons'
import { BackCard, FooterCard } from '../Styled/Card'
import { CenteredColumn } from '../Styled/Layouts'
import { Title } from '../Styled/Typography'

interface LoginFormData {
  email: string
  password: string
}

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<LoginFormData>()
  const { login } = useAuthentication()

  const onSubmit = (data: LoginFormData) => {
    login(data.email, data.password)
  }

  return (
    <CenteredColumn>
      <BackCard>
        <Title>Login</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="email"
            label="Email"
            inputProps={{
              autoFocus: true,
              ...register('email', {
                required: true
              })
            }}
            error={errors.email?.type === 'required' ? 'Email is required' : undefined}
          ></Input>

          <Input
            name="password"
            label="Password"
            inputProps={{
              type: 'password',
              ...register('password', {
                required: true
              })
            }}
            error={errors.password?.type === 'required' ? 'Password is required' : undefined}
          ></Input>
          <br />
          <Button size="large" type="submit" primary>
            Login
          </Button>
        </form>
      </BackCard>
      <FooterCard>
        <Link to={'/register'}>Register</Link>
      </FooterCard>
    </CenteredColumn>
  )
}

export default Login
