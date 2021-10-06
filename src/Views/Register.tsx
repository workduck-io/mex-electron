import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from '../Components/Forms/Input'
import { useAuthentication, useAuthStore } from '../Hooks/useAuth/useAuth'
import { Button } from '../Styled/Buttons'
import { BackCard, FooterCard } from '../Styled/Card'
import { CenteredColumn } from '../Styled/Layouts'
import { Title } from '../Styled/Typography'

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
  const setRegistered = useAuthStore((store) => store.setRegistered)

  const onSubmit = (data: RegisterFormData) => {
    if (!registered) {
      registerDetails(data.email, data.password)
    } else {
      verifySignup(data.email, data.code)
    }
  }

  const onCancelVerification = (e) => {
    e.preventDefault()
    setRegistered(false)
  }

  return (
    <CenteredColumn>
      <BackCard>
        <Title>Register</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          {!registered ? (
            <>
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
                  ...register('password', {
                    required: true
                  })
                }}
                error={errors.password?.type === 'required' ? 'Password is required' : undefined}
              ></Input>
            </>
          ) : (
            <>
              <Input
                name="code"
                label="Code"
                inputProps={{
                  ...register('code', {
                    required: true
                  })
                }}
                error={errors.code?.type === 'required' ? 'Code is required' : undefined}
              ></Input>
            </>
          )}
          <br />
          <Button size="large" type="submit" primary>
            {registered ? 'Verify code' : 'Send Verification Code'}
          </Button>
          {registered && (
            <Button size="large" onClick={onCancelVerification}>
              Cancel
            </Button>
          )}
        </form>
      </BackCard>
      <FooterCard>
        <Link to="/login">Login</Link>
      </FooterCard>
    </CenteredColumn>
  )
}

export default Register
