import { useAuth } from '@workduck-io/dwindle'
import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { AuthForm, ButtonFields, Label, StyledCreatatbleSelect } from '../../style/Form'
import { PasswordRequirements } from '../../components/mex/Auth/errorMessages'
import Input, { InputFormError } from '../../components/mex/Forms/Input'
import { EMAIL_REG, MEX_TAG, PASSWORD } from '../../data/Defaults/auth'
import { useAuthentication, useAuthStore } from '../../services/auth/useAuth'
import { Button } from '../../style/Buttons'
import { BackCard, FooterCard } from '../../style/Card'
import { CenteredColumn } from '../../style/Layouts'
import { Title } from '../../style/Typography'
import { LoadingButton } from '../../components/mex/Buttons/LoadingButton'
import { StyledRolesSelectComponents } from '../../style/Select'
import useOnboard from '../../store/useOnboarding'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../data/IpcAction'
import { useOnboardingData } from '../../components/mex/Onboarding/hooks'

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
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const { resendCode } = useAuth()

  const regErrors = registerForm.formState.errors
  const verErrors = verifyForm.formState.errors

  const regSubmitting = registerForm.formState.isSubmitting
  const verSubmitting = verifyForm.formState.isSubmitting

  const onResendRequest = async (e) => {
    e.preventDefault()
    setReqCode(true)
    await resendCode()
      .then((r) => {
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
      } else {
        ipcRenderer.send(IpcAction.LOGGED_IN, { userDetails: { email: data.email }, loggedIn: true })
      }
    })
  }

  const onVerifySubmit = async (data: VerifyFormData) => {
    const metadata = { tag: MEX_TAG }
    try {
      await verifySignup(data.code, metadata)

      // TODO: Uncomment this when we've new flow for onboarding
      // setOnboardData()
      // changeOnboarding(true)

      // ipcRenderer.send(IpcAction.START_ONBOARDING, { from: AppType.MEX })
    } catch (err) {
      toast('Error occured!')
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
