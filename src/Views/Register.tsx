import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuthentication, useAuthStore } from '../Hooks/useAuth/useAuth'
import { Card } from '../Styled/Card'
import { InputBlock } from '../Styled/Form'
import Centered from '../Styled/Layouts'

interface RegisterFormData {
  code: string
  email: string
  password: string
}

const Register = () => {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<RegisterFormData>()

  const { registerDetails, verifySignup } = useAuthentication()
  const registered = useAuthStore((store) => store.registered)

  const onSubmit = (data: RegisterFormData) => {
    if (!registered) {
      registerDetails(data.email, data.password)
    } else {
      verifySignup(data.email, data.code)
    }
  }

  return (
    <Centered>
      <Card>
        <h1>Register</h1>
        <p>Please Register</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!registered ? (
            <>
              <InputBlock {...register('email', { required: true })} />
              {errors.email?.type === 'required' && 'Email is required'}
              <InputBlock {...register('password', { required: true })} />
              {errors.password?.type === 'required' && 'Password is required'}
            </>
          ) : (
            <>
              <InputBlock {...register('code', { required: !registered })} />
              {errors.email?.type === 'required' && 'Name is required'}
            </>
          )}
          <InputBlock type="submit" />
        </form>
      </Card>
    </Centered>
  )
}

export default Register
