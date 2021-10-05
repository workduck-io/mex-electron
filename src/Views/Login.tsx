import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useAuthentication } from '../Hooks/useAuth/useAuth'
import { Card } from '../Styled/Card'
import { InputBlock } from '../Styled/Form'
import Centered from '../Styled/Layouts'

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
    <Centered>
      <Card>
        <h1>Login</h1>
        <p>Please login</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputBlock {...register('email', { required: true })} />
          {errors.email?.type === 'required' && 'Email is required'}
          <InputBlock {...register('password', { required: true })} />
          {errors.password?.type === 'required' && 'Password is required'}

          <InputBlock type="submit" />
        </form>
        <Link to={'/register'}>Register</Link>
      </Card>
    </Centered>
  )
}

export default Login
