import React, { useState } from 'react'

import { mog } from '@utils/lib/mog'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

import { useAuth } from '@workduck-io/dwindle'
import { Button, LoadingButton } from '@workduck-io/mex-components'

import { PasswordNotMatch, PasswordRequirements } from '../../components/mex/Auth/errorMessages'
import { GoogleLoginButton } from '../../components/mex/Buttons/LoadingButton'
import Input, { InputFormError } from '../../components/mex/Forms/Input'
import { ALIAS_REG, EMAIL_REG, MEX_TAG, PASSWORD } from '../../data/Defaults/auth'
import { useAuthentication, useAuthStore, useInitializeAfterAuth } from '../../services/auth/useAuth'
import { BackCard, FooterCard } from '../../style/Card'
import { AuthForm, ButtonFields, Label, StyledCreatatbleSelect } from '../../style/Form'
import { CenteredColumn } from '../../style/Layouts'
import { StyledRolesSelectComponents } from '../../style/Select'
import { Title } from '../../style/Typography'
import { ROUTE_PATHS } from '../routes/urls'

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

  const [regFormData, setRegFormData] = useState<RegisterFormData>()

  const { registerDetails, verifySignup } = useAuthentication()
  const registered = useAuthStore((store) => store.registered)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  // const changeOnboarding = useOnboard((s) => s.changeOnboarding)
  const { resendCode } = useAuth()
  // const { setOnboardData } = useTourData()

  const regErrors = registerForm.formState.errors
  const verErrors = verifyForm.formState.errors

  const regSubmitting = registerForm.formState.isSubmitting
  const verSubmitting = verifyForm.formState.isSubmitting

  const { initializeAfterAuth } = useInitializeAfterAuth()

  const onResendRequest = async (e) => {
    e.preventDefault()
    setReqCode(true)
    await resendCode()
      .then((r) => {
        toast('Verification code sent!')
      })
      .catch(() => toast.error('Code could not be sent'))

    setReqCode(false)
  }

  const onRegisterSubmit = async (data: RegisterFormData) => {
    await registerDetails(data).then((s) => {
      if (s === 'UsernameExistsException') {
        toast('You have already registered, please verify code.')
      }
      setRegFormData(data)
    })
  }

  const onVerifySubmit = async (data: VerifyFormData) => {
    const metadata = { tag: MEX_TAG }
    try {
      const loginData = await verifySignup(data.code, metadata)
      const userRole = regFormData.roles.map((r) => r.value).join(', ') ?? ''
      await initializeAfterAuth(loginData, true, false, true, userRole)

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
                  style={{ margin: '0 auto' }}
                  alsoDisabled={regErrors.email !== undefined || regErrors.password !== undefined || !arePasswordEqual}
                  type="submit"
                  primary
                  large
                >
                  Send Verification Code
                </LoadingButton>
              </ButtonFields>
            </AuthForm>
            <ButtonFields>
              <GoogleLoginButton text={'Signup via Google'} />
            </ButtonFields>
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

            <LoadingButton loading={reqCode} id="resendCodeButton" onClick={onResendRequest}>
              Resend Code
            </LoadingButton>
            <ButtonFields>
              <Button large onClick={onCancelVerification}>
                Cancel
              </Button>
              <LoadingButton
                loading={verSubmitting}
                alsoDisabled={verErrors.code !== undefined}
                type="submit"
                primary
                large
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
