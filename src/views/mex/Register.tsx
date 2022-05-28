import { AuthForm, ButtonFields, Label, StyledCreatatbleSelect } from '../../style/Form'
import { BackCard, FooterCard } from '../../style/Card'
import { Controller, useForm } from 'react-hook-form'
import { ALIAS_REG, EMAIL_REG, MEX_TAG, PASSWORD } from '../../data/Defaults/auth'
import Input, { InputFormError } from '../../components/mex/Forms/Input'
import React, { useState } from 'react'
import { useAuthStore, useAuthentication } from '../../services/auth/useAuth'

import { AppType } from '../../hooks/useInitialize'
import { Button } from '../../style/Buttons'
import { CenteredColumn } from '../../style/Layouts'
import { IpcAction } from '../../data/IpcAction'
import { Link } from 'react-router-dom'
import { LoadingButton, GoogleLoginButton } from '../../components/mex/Buttons/LoadingButton'
import { PasswordNotMatch, PasswordRequirements } from '../../components/mex/Auth/errorMessages'
import { ROUTE_PATHS } from '../routes/urls'
import { StyledRolesSelectComponents } from '../../style/Select'
import { Title } from '../../style/Typography'
import { ipcRenderer } from 'electron'
import toast from 'react-hot-toast'
import { useAuth } from '@workduck-io/dwindle'
import useOnboard from '../../store/useOnboarding'
import { useTourData } from '../../components/mex/Onboarding/hooks'

export interface Option {
  label: string
  value: string
}

export interface RegisterFormData {
  name: string
  alias: string
  roles: Option[]
  email: string
  password: string
  confirmPassword?: string
}

const UserRoleValues = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'product-ops', label: 'Product Ops' },
  { value: 'testing', label: 'Testing' }
]

interface VerifyFormData {
  code: string
}
const Register = () => {
  const [reqCode, setReqCode] = useState(false)
  const [password, setPassword] = useState<string>()
  const [arePasswordEqual, setArePasswordEqual] = useState<boolean>(true)
  const registerForm = useForm<RegisterFormData>()
  const verifyForm = useForm<VerifyFormData>()

  const { registerDetails, verifySignup } = useAuthentication()
  const registered = useAuthStore((store) => store.registered)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const { resendCode } = useAuth()
  const { setOnboardData } = useTourData()

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
          <>
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

              <InputFormError
                name="alias"
                label="Alias"
                inputProps={{
                  placeholder: 'Ex: CoolGuy',
                  autoFocus: true,
                  ...registerForm.register('alias', {
                    required: true,
                    pattern: ALIAS_REG
                  })
                }}
                additionalInfo="Only Alphanumeric as content, and -_ as separators allowed"
                errors={regErrors}
              ></InputFormError>

              <Label htmlFor="roles">What is your role in your organization?</Label>
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
                    pattern: PASSWORD,
                    onChange: (e) => setPassword(e.target.value)
                  })
                }}
                errors={regErrors}
              ></InputFormError>

              {regErrors.password?.type === 'pattern' ? <PasswordRequirements /> : undefined}

              <InputFormError
                name="confirmpassword"
                label="Confirm Password"
                inputProps={{
                  type: 'password',
                  ...registerForm.register('confirmPassword', {
                    required: true,
                    pattern: PASSWORD,
                    deps: ['password'],
                    onChange: (e) => {
                      if (e.target.value.toString() !== password) {
                        setArePasswordEqual(false)
                      } else {
                        setArePasswordEqual(true)
                      }
                    }
                  })
                }}
                errors={regErrors}
              ></InputFormError>

              {!arePasswordEqual ? <PasswordNotMatch /> : undefined}

              <ButtonFields>
                <LoadingButton
                  loading={regSubmitting}
                  alsoDisabled={regErrors.email !== undefined || regErrors.password !== undefined || !arePasswordEqual}
                  buttonProps={{ type: 'submit', primary: true, large: true }}
                >
                  Send Verification Code
                </LoadingButton>
              </ButtonFields>
            </AuthForm>
            <GoogleLoginButton text={'Signup via Google'} />
          </>
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
        <Link to={ROUTE_PATHS.login}>Login</Link>
      </FooterCard>
    </CenteredColumn>
  )
}

export default Register
