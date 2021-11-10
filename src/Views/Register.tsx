import { useAuth } from '@workduck-io/dwindle'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { AuthForm } from '../Styled/Form'
import { PasswordRequirements } from '../Components/Auth/errorMessages'
import Input, { InputFormError } from '../Components/Forms/Input'
import { EMAIL_REG, PASSWORD } from '../Defaults/auth'
import { useAuthentication, useAuthStore } from '../Hooks/useAuth/useAuth'
import { Button } from '../Styled/Buttons'
import { BackCard, FooterCard } from '../Styled/Card'
import { CenteredColumn } from '../Styled/Layouts'
import { Title } from '../Styled/Typography'
import { LoadingButton } from '../Components/Buttons/LoadingButton'

interface RegisterFormData {
  email: string
  password: string
}

interface VerifyFormData {
  code: string
}
const Register = () => {
  const [reqCode, setReqCode] = useState(false)
  const registerForm = useForm<RegisterFormData>()
  const verifyForm = useForm<VerifyFormData>()

  const { registerDetails, verifySignup } = useAuthentication()
  const registered = useAuthStore((store) => store.registered)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const { resendCode } = useAuth()

  const regErrors = registerForm.formState.errors
  const verErrors = verifyForm.formState.errors

  const regSubmitting = registerForm.formState.isSubmitting
  const verSubmitting = verifyForm.formState.isSubmitting

  const onResendRequest = async (e) => {
    e.preventDefault()
    console.log('we are resending code')
    setReqCode(true)
    await resendCode()
      .then((r) => {
        console.log(r)
        toast('Verification code sent!')
      })
      .catch(() => toast.error('Code could not be sent'))

    // setTimeout(() => {
    setReqCode(false)
    // }, 20000)
  }

  const onRegisterSubmit = async (data: RegisterFormData) => {
    await registerDetails(data.email, data.password).then((s) => {
      if (s === 'UsernameExistsException') {
        toast('You have already registered, please verify code.')
      }
    })
  }

  const onVerifySubmit = async (data: VerifyFormData) => {
    const metadata = { tag: 'mex' }
    await verifySignup(data.code, metadata)
  }

  const onCancelVerification = (e) => {
    e.preventDefault()
    setRegistered(false)
  }

  return (
    <CenteredColumn>
      <BackCard>
        <Title>Register</Title>
        {!registered ? (
          <AuthForm onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
            <InputFormError
              name="email"
              label="Email"
              inputProps={{
                autoFocus: true,
                ...registerForm.register('email', {
                  required: true,
                  pattern: EMAIL_REG
                })
              }}
              errors={regErrors}
            ></InputFormError>

            <InputFormError
              name="password"
              label="Password"
              inputProps={{
                type: 'password',
                ...registerForm.register('password', {
                  required: true,
                  pattern: PASSWORD
                })
              }}
              errors={regErrors}
            ></InputFormError>

            {regErrors.password?.type === 'pattern' ? <PasswordRequirements /> : undefined}
            <LoadingButton
              loading={regSubmitting}
              alsoDisabled={regErrors.email !== undefined || regErrors.password !== undefined}
              buttonProps={{ type: 'submit', primary: true, large: true }}
            >
              Send Verification Code
            </LoadingButton>
          </AuthForm>
        ) : (
          <AuthForm onSubmit={verifyForm.handleSubmit(onVerifySubmit)}>
            <Input
              name="code"
              label="Code"
              inputProps={{
                ...verifyForm.register('code', {
                  required: true
                })
              }}
              error={verErrors.code?.type === 'required' ? 'Code is required' : undefined}
            ></Input>

            <LoadingButton
              loading={reqCode}
              buttonProps={{
                id: 'resendCodeButton',
                primary: true,
                onClick: onResendRequest
              }}
            >
              Resend Code
            </LoadingButton>
            <LoadingButton
              loading={verSubmitting}
              alsoDisabled={verErrors.code !== undefined}
              buttonProps={{ type: 'submit', primary: true, large: true }}
            >
              Verify Code
            </LoadingButton>
            <Button large onClick={onCancelVerification}>
              Cancel
            </Button>
          </AuthForm>
        )}
        <br />
      </BackCard>
      <FooterCard>
        <Link to="/login">Login</Link>
      </FooterCard>
    </CenteredColumn>
  )
}

export default Register
