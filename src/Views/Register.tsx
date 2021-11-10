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
  code: string
  email: string
  password: string
}

const Register = () => {
  const [reqCode, setReqCode] = useState(false)
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>()

  const { registerDetails, verifySignup } = useAuthentication()
  const registered = useAuthStore((store) => store.registered)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const { resendCode } = useAuth()

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

  const onSubmit = async (data: RegisterFormData) => {
    const metadata = { tag: 'mex' }
    if (!registered) {
      await registerDetails(data.email, data.password).then((s) => {
        if (s === 'UsernameExistsException') {
          toast('You have already registered, please verify code.')
        }
      })
    } else {
      // console.log(data.code, metadata)
      verifySignup(data.code, metadata)
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
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
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
            </>
          )}
          <br />

          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={errors.email !== undefined || errors.password !== undefined}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            {registered ? 'Verify code' : 'Send Verification Code'}
          </LoadingButton>
          {registered && (
            <Button large onClick={onCancelVerification}>
              Cancel
            </Button>
          )}
        </AuthForm>
      </BackCard>
      <FooterCard>
        <Link to="/login">Login</Link>
      </FooterCard>
    </CenteredColumn>
  )
}

export default Register
