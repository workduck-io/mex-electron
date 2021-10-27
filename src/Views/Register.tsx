import { useAuth } from '@workduck-io/dwindle'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import { PasswordRequirements } from '../Components/Auth/errorMessages'
import Input, { InputFormError } from '../Components/Forms/Input'
import { EMAIL_REG, PASSWORD } from '../Defaults/auth'
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
  const history = useHistory()
  const { resendCode } = useAuth()

  const onSubmit = (data: RegisterFormData) => {
    const metadata = { tag: 'mex' }
    if (!registered) {
      registerDetails(data.email, data.password)
    } else {
      verifySignup(data.code, metadata).then((d) => {
        if (d === 'SUCCESS') {
          history.push('/login')
        }
      })
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
                    required: true,
                    pattern: PASSWORD
                  })
                }}
                errors={errors}
              ></InputFormError>

              {errors.password?.type === 'pattern' ? <PasswordRequirements /> : undefined}
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

              <Button
                size="large"
                onClick={(e) => {
                  e.preventDefault()

                  resendCode()
                }}
              >
                Resend Code
              </Button>
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
