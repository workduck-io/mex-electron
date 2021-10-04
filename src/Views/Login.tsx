import React from 'react'
import { useForm } from 'react-hook-form'
import { signIn } from '../Requests/Auth/Login'
import { InputBlock } from '../Styled/Form'

interface LoginFormData {
  email: string
  password: string
}

const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    const res = await signIn({
      email: data.email,
      password: data.password
    })
    console.log({ data, res })
  }

  return (
    <div>
      <h1>Login</h1>
      <p>Please login</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputBlock {...register('email', { required: true })} />
        {errors.email?.type === 'required' && 'Email is required'}
        <InputBlock {...register('password', { required: true })} />
        {errors.password?.type === 'required' && 'Password is required'}

        <InputBlock type="submit" />
      </form>
    </div>
  )
}

export default Login
