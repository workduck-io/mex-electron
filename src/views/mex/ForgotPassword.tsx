import { AuthForm, ButtonFields, Label, StyledCreatatbleSelect } from '../../style/Form'
import { BackCard, FooterCard } from '../../style/Card'
import { Controller, useForm } from 'react-hook-form'
import { EMAIL_REG, MEX_TAG, PASSWORD } from '../../data/Defaults/auth'
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
import { NavigationType, ROUTE_PATHS, useRouting } from '../routes/urls'
import { StyledRolesSelectComponents } from '../../style/Select'
import { Title } from '../../style/Typography'
import { ipcRenderer } from 'electron'
import toast from 'react-hot-toast'
import { useAuth } from '@workduck-io/dwindle'
import useOnboard from '../../store/useOnboarding'
import { useTourData } from '../../components/mex/Onboarding/hooks'
import { mog } from '../../utils/lib/helper'

export interface Option {
  label: string
  value: string
}

export interface ForgotPasswordFormData {
  email: string
  newpassword: string
  confirmNewPassword: string
}
interface VerifyFormData {
  code: string
}
const ForgotPassword = () => {
  const [reqCode, setReqCode] = useState(false)
  const [newPassword, setNewPassword] = useState<string>()
  const [arePasswordEqual, setArePasswordEqual] = useState<boolean>(true)
  const forgotPasswordForm = useForm<ForgotPasswordFormData>()
  const verifyForm = useForm<VerifyFormData>()
  const { goTo } = useRouting()
  const isForgottenPassword = useAuthStore((store) => store.isForgottenPassword)
  const setIsForgottenPassword = useAuthStore((store) => store.setIsForgottenPassword)
  const { resendCode, forgotPassword, verifyForgotPassword } = useAuth()

  const regErrors = forgotPasswordForm.formState.errors
  const verErrors = verifyForm.formState.errors

  const regSubmitting = forgotPasswordForm.formState.isSubmitting
  const verSubmitting = verifyForm.formState.isSubmitting

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    setIsForgottenPassword(true)
    setNewPassword(data.newpassword)
    await forgotPassword(data.email)
  }

  const onVerifySubmit = async (data: VerifyFormData) => {
    try {
      const res = await verifyForgotPassword(data.code, newPassword)
      if (res === 'SUCCESS') {
        toast('Password changed successfully')
        goTo(ROUTE_PATHS.login, NavigationType.push)
      } else {
        toast('Something went wrong, Try again')
        goTo(ROUTE_PATHS.forgotpassword, NavigationType.push)
      }
    } catch (err) {
      toast('Error occured!')
    }
    setIsForgottenPassword(false)
  }

  const onCancelVerification = (e) => {
    e.preventDefault()
    setIsForgottenPassword(false)
  }

  return (
    <CenteredColumn>
      <BackCard>
        <Title>Forgot Password</Title>
        {!isForgottenPassword ? (
          <>
            <AuthForm onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}>
              <InputFormError
                name="email"
                label="Email"
                inputProps={{
                  ...forgotPasswordForm.register('email', {
                    required: true,
                    pattern: EMAIL_REG
                  })
                }}
                errors={regErrors}
              ></InputFormError>
              <InputFormError
                name="newpassword"
                label="New Password"
                inputProps={{
                  type: 'password',
                  ...forgotPasswordForm.register('newpassword', {
                    required: true,
                    pattern: PASSWORD,
                    onChange: (e) => setNewPassword(e.target.value)
                  })
                }}
                errors={regErrors}
              ></InputFormError>

              {regErrors.newpassword?.type === 'pattern' ? <PasswordRequirements /> : undefined}

              <InputFormError
                name="confirmnewpassword"
                label="Confirm New Password"
                inputProps={{
                  type: 'password',
                  ...forgotPasswordForm.register('confirmNewPassword', {
                    required: true,
                    pattern: PASSWORD,
                    deps: ['newpassword'],
                    onChange: (e) => {
                      if (e.target.value.toString() !== newPassword) {
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
                  alsoDisabled={
                    regErrors.email !== undefined || regErrors.newpassword !== undefined || !arePasswordEqual
                  }
                  buttonProps={{ type: 'submit', primary: true, large: true }}
                >
                  Send Verification Code
                </LoadingButton>
              </ButtonFields>
            </AuthForm>
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

export default ForgotPassword