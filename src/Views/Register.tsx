import { useAuth } from '@workduck-io/dwindle'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { AuthForm, ButtonFields, Label, StyledCreatatbleSelect } from '../Styled/Form'
import { PasswordRequirements } from '../Components/Auth/errorMessages'
import Input, { InputFormError } from '../Components/Forms/Input'
import { EMAIL_REG, MEX_TAG, PASSWORD } from '../Defaults/auth'
import { useAuthentication, useAuthStore } from '../Hooks/useAuth/useAuth'
import { Button } from '../Styled/Buttons'
import { BackCard, FooterCard } from '../Styled/Card'
import { CenteredColumn } from '../Styled/Layouts'
import { Title } from '../Styled/Typography'
import { LoadingButton } from '../Components/Buttons/LoadingButton'
import { StyledRolesSelectComponents } from '../Styled/Select'

export interface Option {
  label: string
  value: string
}

export interface RegisterFormData {
  name: string
  roles: Option[]
  email: string
  password: string
}

const UserRoleValues = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'testing', label: 'Testing' }
]

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
    await registerDetails(data).then((s) => {
      if (s === 'UsernameExistsException') {
        toast('You have already registered, please verify code.')
      }
    })
  }

  const onVerifySubmit = async (data: VerifyFormData) => {
    const metadata = { tag: MEX_TAG }
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
              name="name"
              label="Name"
              inputProps={{
                autoFocus: true,
                ...registerForm.register('name', {
                  required: true
                })
              }}
              errors={regErrors}
            ></InputFormError>

            <InputFormError
              name="email"
              label="Email"
              inputProps={{
                ...registerForm.register('email', {
                  required: true,
                  pattern: EMAIL_REG
                })
              }}
              errors={regErrors}
            ></InputFormError>

            <Label htmlFor="roles">What roles are you part of?</Label>
            <Controller
              control={registerForm.control}
              render={({ field }) => (
                <StyledCreatatbleSelect
                  {...field}
                  isMulti
                  isCreatable
                  options={UserRoleValues}
                  closeMenuOnSelect={true}
                  closeMenuOnBlur={false}
                  components={StyledRolesSelectComponents}
                  placeholder="Ex. Developer, Designer"
                />
              )}
              rules={{ required: true }}
              name="roles"
            />

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

            <ButtonFields>
              <LoadingButton
                loading={regSubmitting}
                alsoDisabled={regErrors.email !== undefined || regErrors.password !== undefined}
                buttonProps={{ type: 'submit', primary: true, large: true }}
              >
                Send Verification Code
              </LoadingButton>
            </ButtonFields>
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
                onClick: onResendRequest
              }}
            >
              Resend Code
            </LoadingButton>
            <ButtonFields>
              <Button large onClick={onCancelVerification}>
                Cancel
              </Button>
              <LoadingButton
                loading={verSubmitting}
                alsoDisabled={verErrors.code !== undefined}
                buttonProps={{ type: 'submit', primary: true, large: true }}
              >
                Verify Code
              </LoadingButton>
            </ButtonFields>
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
