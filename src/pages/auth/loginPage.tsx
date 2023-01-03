import React, {useEffect, useState} from 'react'
import {Box, FormControl, TextField, FormHelperText} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import Visibility from '@mui/icons-material/Visibility'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import {useNavigate} from 'react-router'
import {NavLink} from 'react-router-dom'
import AuthBG from '../../assets/images/authBG'
import SignInIllu1 from '../../assets/images/signInIllu1'
import SignInIllu2 from '../../assets/images/signInIllu2'
import useStylesButton from '../../assets/makeStyles/buttons/buttons'
import MakeStyles from '../../assets/makeStyles/makeStyles'
import AuthenticationsApi from '../../api/authentication'
import {UseUserContext} from '../../context/userContext/userContext'
import {IUserProps} from '../../context/userContext/userContext.props'
import Regex from '../../constants/regex'
import ButtonBlue from '../../layouts/buttons/buttonBlue'
import PopoverContainer from '../../layouts/popover/popover'

const LoginPage = () => {
  const {setUserId, setEmail, email, setAccessToken, setRole, setSignedUp, signedUp} =
    UseUserContext() as IUserProps
  const navigate = useNavigate()

  const regEmail = Regex.email

  const classes = MakeStyles()
  const classesButton = useStylesButton()

  const [isActive, setIsActive] = useState<boolean>(true)
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [signInError, setSignInError] = useState<boolean>(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showPopover, setShowPopover] = useState<boolean>(false)

  useEffect(() => {
    if (signedUp) {
      setShowPopover(true)
      setSignedUp(false)
    }
  }, [signedUp])

  useEffect(() => {
    if (signInError && !email) {
      setEmailErrorMessage('Email is required')
    } else if (signInError && !regEmail.test(email)) {
      setEmailErrorMessage('Invalid Email')
    } else {
      setEmailErrorMessage('')
    }
  }, [email, signInError])

  const handleClosePopover = () => {
    setShowPopover(false)
  }

  const login = async () => {
    if (email && password) {
      setSignInError(false)
      const response: any = await AuthenticationsApi.logIn({email, password})

      if (response.status === 200) {
        setErrorMessage('')
        setIsActive(response.data.isActive)
        if (response.data.isActive) {
          localStorage.setItem('accessToken', response.data.accessToken)
          localStorage.setItem('userId', response.data.userId)
          localStorage.setItem('password', password)
          localStorage.setItem('role', response.data.role)
          setEmail(response.data.email)
          setUserId(response.data.userId)
          setRole(response.data.role)
          setAccessToken(response.data.accessToken)
        }
      } else {
        setErrorMessage(response.response.data.message)
      }
    } else {
      setSignInError(true)
    }
  }

  const forgotPassword = () => {
    navigate('/forgot-password')
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
  }

  return (
    <div className="container auth-container">
      <div className="auth-content_wrapper">
        <div className="auth-content_bg">
          <AuthBG />
        </div>
        <div className="auth_content">
          <Stack direction="column">
            <Box className="auth_title mt-52">Log in</Box>
            <Box className="auth_text">Don&apos;t have an account yet?</Box>
            <Box className="mt-4 font-size-16 font-weight-400 line-height-22">
              <NavLink to="/sign-up">Sign up now</NavLink>
            </Box>
            <PopoverContainer
              open={showPopover}
              onClose={handleClosePopover}
              title="Your account is succesfully created."
            />
            <Box className="mt-26">
              <FormControl fullWidth error={!!(signInError && emailErrorMessage)}>
                <TextField
                  fullWidth
                  className={`${classes.w100} ${classes.inputStyle} ${classes.bgGray}`}
                  size="small"
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  value={email}
                  error={!!(signInError && emailErrorMessage)}
                />
                <FormHelperText id="outlined-basic">{emailErrorMessage}</FormHelperText>
              </FormControl>
            </Box>
            <Box className="mt-26">
              <FormControl
                fullWidth
                // sx={{marginTop: '20px'}}
                className={`${classes.w100} ${classes.inputStyle} ${classes.bgGray}`}
                error={!!(signInError && !password)}
                size="small"
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  error={!!(signInError && !password)}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText id="outlined-adornment-password">
                  {signInError && !password ? 'Password is required' : ''}
                </FormHelperText>
              </FormControl>
            </Box>
            {/*<FormControlLabel*/}
            {/*  className={`${classesFields.checkboxStyle} auth_checkbox`}*/}
            {/*  control={<Checkbox />}*/}
            {/*  label="Keep me signed in"*/}
            {/*/>*/}
            <Box className="mt-50">
              <ButtonBlue fullWidth handleClick={login} title="Log in" />
            </Box>
            {errorMessage && <Box className="error-message">{errorMessage}</Box>}
            {!isActive && <Box className="error-message">Pending Email Verification</Box>}
            <Box className="mt-6">
              <Button
                color="blue"
                onClick={forgotPassword}
                className={`${classesButton.transparentButton}`}
              >
                Forgot Password?{' '}
              </Button>
            </Box>
          </Stack>
        </div>
      </div>
      <div className="auth-image_wrapper">
        <Box>
          <SignInIllu1 />
        </Box>
        <Box>
          <SignInIllu2 />
        </Box>
      </div>
    </div>
  )
}

export default LoginPage
