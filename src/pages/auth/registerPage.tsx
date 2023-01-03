import React, {useEffect, useState} from 'react'
import {
  Box,
  // Checkbox,
  CircularProgress,
  FormControl,
  // FormControlLabel,
  FormHelperText,
  TextField,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Stack from '@mui/material/Stack'
import {NavLink} from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import {useNavigate} from 'react-router'
import AuthBG from '../../assets/images/authBG'
import SignUpIllu1 from '../../assets/images/signUpIllu1'
import SignUpIllu2 from '../../assets/images/signUpIllu2'
import MakeStyles from '../../assets/makeStyles/makeStyles'
// import useStylesTextFields from '../../assets/makeStyles/textFields/textFields'
import AuthenticationsApi from '../../api/authentication'
import Regex from '../../constants/regex'
import ButtonBlue from '../../layouts/buttons/buttonBlue'
import {UseUserContext} from '../../context/userContext/userContext'
import {IUserProps} from '../../context/userContext/userContext.props'

const RegisterPage = () => {
  // const classesFields = useStylesTextFields()
  const classes = MakeStyles()
  const navigate = useNavigate()
  const {setSignedUp} = UseUserContext() as IUserProps
  const regEmail = Regex.email
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [signUpError, setSignUpError] = useState<boolean>(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [success, setSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
  }

  const onSuccess = (res: any) => {
    console.log('success:', res)
  }
  const onFailure = (err: any) => {
    console.log('failed:', err)
  }

  const clientId = '386932037035-k8v833noqjk7m4auae0t83vnkrqvvg3t.apps.googleusercontent.com'

  const handleSignUp = async () => {
    if (
      firstName &&
      lastName &&
      email &&
      password &&
      confirmPassword &&
      regEmail.test(email) &&
      confirmPassword === password
    ) {
      setSignUpError(false)
      setIsLoading(true)
      const form = new FormData()
      form.append('FirstName', firstName)
      form.append('LastName', lastName)
      form.append('Position', '')
      form.append('Email', email)
      form.append('Password', password)
      form.append('ConfirmPassword', confirmPassword)

      const response: any = await AuthenticationsApi.signUp(form)
      setIsLoading(false)
      if (response.status === 200) {
        setSuccess(true)
        setErrorMessage('')
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setShowPassword(false)
        setShowConfirmPassword(false)
        setSignedUp(true)
        navigate('/sign-in')
      } else {
        setSuccess(false)
        setErrorMessage(response.response.data.message)
      }
    } else {
      setSignUpError(true)
      setSuccess(false)
    }
  }

  useEffect(() => {
    if (signUpError && !email) {
      setEmailErrorMessage('Email is required')
    } else if (signUpError && !regEmail.test(email)) {
      setEmailErrorMessage('Invalid Email')
    } else {
      setEmailErrorMessage('')
    }

    if (signUpError && !confirmPassword) {
      setConfirmPasswordErrorMessage('Repeat Password is required')
    } else if (signUpError && confirmPassword !== password) {
      setConfirmPasswordErrorMessage('Please make sure passwords match')
    } else {
      setConfirmPasswordErrorMessage('')
    }
  }, [confirmPassword, password, email, signUpError])

  return (
    <div className="container auth-container">
      <div className="auth-content_wrapper">
        <div className="auth-content_bg">
          <AuthBG />
        </div>
        <div className="auth_content">
          <Stack direction="column">
            <Box className="auth_title mt-52">Create Account</Box>
            <Box className="mt-34 d-flex justify-between">
              <GoogleLogin
                buttonText="Sign up with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy="single_host_origin"
                isSignedIn
                clientId={clientId}
              />
            </Box>
            <Box className="d-flex justify-center">
              <Box className="color-light-gray2 font-size-18 font-weight-400 mt-40">OR</Box>
            </Box>
            {/*<Box className="auth_text">Already have an account?</Box>*/}
            {/*<Box className="mt-4 font-size-16 font-weight-400 line-height-22">*/}
            {/*  <NavLink to="/sign-in">Sign in</NavLink>*/}
            {/*</Box>*/}
            <Box className={`${classes.marginTop26}`}>
              <FormControl error={!!(signUpError && !firstName)} fullWidth>
                <TextField
                  className={`${classes.w100} ${classes.inputStyle} ${classes.bgGray}`}
                  fullWidth
                  error={!!(signUpError && !firstName)}
                  id="outlined-basic"
                  label="First Name"
                  size="small"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  variant="outlined"
                />
                <FormHelperText id="outlined-adornment-password">
                  {signUpError && !firstName ? 'First Name is required' : ''}
                </FormHelperText>
              </FormControl>
            </Box>
            <Box className={`${classes.marginTop26}`}>
              <FormControl error={!!(signUpError && !lastName)} fullWidth>
                <TextField
                  className={`${classes.w100} ${classes.inputStyle} ${classes.bgGray}`}
                  fullWidth
                  id="outlined-basic"
                  error={!!(signUpError && !lastName)}
                  label="Last Name"
                  size="small"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  variant="outlined"
                />
                <FormHelperText id="outlined-adornment-password">
                  {signUpError && !lastName ? 'Last Name is required' : ''}
                </FormHelperText>
              </FormControl>
            </Box>
            <Box className={`${classes.marginTop26}`}>
              <FormControl fullWidth error={!!(signUpError && emailErrorMessage)}>
                <TextField
                  error={!!(signUpError && emailErrorMessage)}
                  className={`${classes.w100} ${classes.inputStyle} ${classes.bgGray}`}
                  fullWidth
                  id="outlined-basic2"
                  label="Email"
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                />{' '}
                <FormHelperText id="outlined-adornment-password">
                  {emailErrorMessage}
                </FormHelperText>
              </FormControl>
            </Box>
            <Box className={`${classes.marginTop26}`}>
              <FormControl
                className={`${classes.w100} ${classes.inputStyle} ${classes.bgGray}`}
                fullWidth
                error={!!(signUpError && !password)}
                size="small"
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  value={password}
                  error={!!(signUpError && !password)}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText id="outlined-adornment-password">
                  {signUpError && !password ? 'Password is required' : ''}
                </FormHelperText>
              </FormControl>
            </Box>
            <Box className={`${classes.marginTop26}`}>
              <FormControl
                className={`${classes.w100} ${classes.inputStyle} ${classes.bgGray}`}
                size="small"
                error={!!(signUpError && confirmPasswordErrorMessage)}
                fullWidth
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-repeat-password">
                  Confirmation Password
                </InputLabel>
                <OutlinedInput
                  error={!!(signUpError && confirmPasswordErrorMessage)}
                  id="outlined-adornment-repeat-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  label="Confirmation Password"
                />
                <FormHelperText id="outlined-adornment-repeat-password">
                  {signUpError && confirmPasswordErrorMessage}
                </FormHelperText>
              </FormControl>
            </Box>
            {/*<FormControlLabel*/}
            {/*  className={`${classesFields.checkboxStyle} auth_checkbox`}*/}
            {/*  control={<Checkbox />}*/}
            {/*  label="Keep me signed in"*/}
            {/*/>*/}
            <Box className={`${classes.marginTop50} text-center`}>
              {isLoading ? (
                <Box className="m-auto width-100">
                  <CircularProgress />
                </Box>
              ) : (
                <ButtonBlue fullWidth handleClick={handleSignUp} title="Create Account" />
              )}
            </Box>
            <Box className="font-size-15 mt-20 color-light-gray2 font-weight-400 line-height-20">
              Already have an account? <NavLink to="/sign-in">Log in</NavLink>{' '}
            </Box>
            {errorMessage && <Box className="error-message">{errorMessage}</Box>}
            {success && <Box className="success-message">You are all signed up</Box>}
          </Stack>
        </div>
      </div>
      <div className="auth-image_wrapper">
        <Box>
          <SignUpIllu1 />
        </Box>
        <Box>
          <SignUpIllu2 />
        </Box>
      </div>
    </div>
  )
}

export default RegisterPage
