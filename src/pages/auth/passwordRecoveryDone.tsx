import React, {useEffect, useState} from 'react'
import {Box, FormControl, FormHelperText} from '@mui/material'
import Stack from '@mui/material/Stack'
import {useSearchParams} from 'react-router-dom'
import {useNavigate} from 'react-router'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CheckIcon from '../../assets/images/Icons/checkIcon'
import MakeStyles from '../../assets/makeStyles/makeStyles'
import PassRecovDone from '../../assets/images/passRecovDone'
import AuthBG from '../../assets/images/authBG'
import CloseIcon from '../../assets/images/Icons/closeIcon'
import AuthenticationsApi from '../../api/authentication'
import ButtonBlue from '../../layouts/buttons/buttonBlue'

const PasswordRecoveryDone = () => {
  const classes = MakeStyles()
  const navigate = useNavigate()
  const [passwordIsSuccessfullyUpdated, setPasswordIsSuccesfullyUpdated] = useState(false)
  const [searchParams] = useSearchParams()
  const forgotToken = searchParams.get('forgot_token')
  const [newPassword, setNewPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [passwordRecoveryError, setPasswordRecoveryError] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const handleSave = async () => {
    if (newPassword && confirmPassword && newPassword === confirmPassword) {
      const formData = new FormData()
      formData.append('ForgotPasswordToken', forgotToken as string)
      formData.append('Password', newPassword)
      formData.append('ConfirmPassword', confirmPassword)
      const response: any = await AuthenticationsApi.forgotPasswordConfirmation(formData)
      if (response.status === 200) {
        setPasswordIsSuccesfullyUpdated(true)
        setPasswordRecoveryError(false)
      } else {
        setErrorMessage(response.response.data.message)
      }
    } else {
      setPasswordRecoveryError(true)
    }
  }

  const handleClose = () => {
    navigate('/sign-in')
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
  }

  useEffect(() => {
    if (passwordRecoveryError && newPassword !== confirmPassword) {
      setErrorMessage('Please make sure passwords match')
    } else {
      setErrorMessage('')
    }
  }, [passwordRecoveryError, newPassword, confirmPassword])

  return (
    <div className="container auth-container">
      <div className="auth-content_wrapper">
        <div className="auth-content_bg">
          <AuthBG />
        </div>
        <div className="auth_content">
          <div className="auth-close">
            <Box className="cursor-pointer" onClick={() => handleClose()}>
              <CloseIcon color="#4F4F4F" />
            </Box>
          </div>
          <div className="forgot-password-container">
            {!passwordIsSuccessfullyUpdated ? (
              <Stack direction="column">
                <p className="auth_title">Password Recovery</p>
                <p className="auth_text">Write your new password</p>
                <Box className={`${classes.marginTop26}`}>
                  <FormControl
                    className={`${classes.w100} ${classes.inputStyle} ${classes.bgGray}`}
                    error={!!(passwordRecoveryError && !newPassword)}
                    size="small"
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      error={!!(passwordRecoveryError && !newPassword)}
                      type={showNewPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="New Password"
                    />
                    <FormHelperText id="outlined-adornment-password">
                      {passwordRecoveryError && !newPassword ? 'New password is required' : ''}
                    </FormHelperText>
                  </FormControl>
                </Box>
                {/*<div className="line-height-12 font-size-10 font-weight-400 color-light-gray mt-6">*/}
                {/*  Password shall be 6+ character , 1 capital letter, 1 number*/}
                {/*</div>*/}
                <Box className={`${classes.marginTop26}`}>
                  <FormControl
                    className={`${classes.w100} ${classes.inputStyle} ${classes.bgGray}`}
                    error={!!(passwordRecoveryError && !confirmPassword)}
                    size="small"
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      error={!!(passwordRecoveryError && !confirmPassword)}
                      type={showConfirmPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                    />
                    <FormHelperText id="outlined-adornment-password">
                      {passwordRecoveryError && !confirmPassword
                        ? 'Confirm password is required'
                        : ''}
                    </FormHelperText>
                  </FormControl>
                </Box>
                <Box className={`${classes.marginTop26}`}>
                  <ButtonBlue fullWidth handleClick={handleSave} title="SAVE" />
                </Box>
                {errorMessage && <Box className="error-message mt-20">{errorMessage}</Box>}
              </Stack>
            ) : (
              <Stack direction="column">
                <p className="auth_title">Password Recovery</p>
                <p className="auth_text">Your password is successfully updated </p>
                <div className="d-flex justify-center mt-48">
                  <CheckIcon />
                </div>
              </Stack>
            )}
          </div>
        </div>
      </div>
      <div className="auth-image_wrapper">
        <PassRecovDone />
      </div>
    </div>
  )
}

export default PasswordRecoveryDone
