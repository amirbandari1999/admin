import React, {useEffect, useState} from 'react'
import {Box, CircularProgress, FormControl, FormHelperText, TextField} from '@mui/material'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'
import Button from '@mui/material/Button'
import MakeStyles from '../../assets/makeStyles/makeStyles'
import {UseUserContext} from '../../context/userContext/userContext'
import {IUserProps} from '../../context/userContext/userContext.props'
import UsersApi from '../../api/users'
import Regex from '../../constants/regex'
import AuthenticationsApi from '../../api/authentication'
import ButtonBlue from '../../layouts/buttons/buttonBlue'

const MyProfile = () => {
  const classes = MakeStyles()
  const {userData} = UseUserContext() as IUserProps
  const [firstName, setFirstName] = useState<string | undefined | Blob>('')
  const [lastName, setLastName] = useState<string | undefined>('')
  const [email, setEmail] = useState<string | undefined>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<string>('')
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('')
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [myProfileError, setMyProfileError] = useState<boolean>(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('')
  const [confirmNewPasswordErrorMessage, setConfirmNewPasswordErrorMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const regEmail = Regex.email
  const [showPasswords, setShowPasswords] = useState<boolean>(false)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
  }

  const handleSave = async () => {
    if (!showPasswords) {
      if (firstName && lastName && email && regEmail.test(email as string)) {
        setIsLoading(true)
        setMyProfileError(false)
        const form = new FormData()

        form.append('FirstName', firstName)
        form.append('LastName', lastName)
        form.append('Email', email as string)

        const response = await UsersApi.updateMyProfile(form)
        setIsLoading(false)
        if (response.status === 200) {
          setSuccess(true)
          setErrorMessage('')
        } else {
          setSuccess(false)
        }
      } else {
        setMyProfileError(true)
        setSuccess(false)
        setErrorMessage('')
      }
    } else if (
      newPassword &&
      password &&
      confirmNewPassword &&
      confirmNewPassword === newPassword
    ) {
      const form = new FormData()

      form.append('Password', newPassword)
      const response = await UsersApi.updateMyProfile(form)

      const form2 = new FormData()
      form2.append('OldPassword', password)
      form2.append('Password', newPassword)
      const response2: any = await AuthenticationsApi.changePassword(form2)

      if (response2.status === 200 && response.status === 200) {
        setSuccess(true)
        setErrorMessage('')
        setPassword('')
        setConfirmNewPassword('')
        setNewPassword('')
        setShowPasswords(false)
        setMyProfileError(false)
      } else {
        setErrorMessage(response2.response.data.message)
      }
    } else {
      setMyProfileError(true)
      setSuccess(false)
      setErrorMessage('')
    }
  }

  useEffect(() => {
    if (myProfileError && !email) {
      setEmailErrorMessage('Email is required')
    } else if (myProfileError && !regEmail.test(email as string)) {
      setEmailErrorMessage('Invalid Email')
    } else {
      setEmailErrorMessage('')
    }

    if (myProfileError && !confirmNewPassword) {
      setConfirmNewPasswordErrorMessage('Confirm Password is required')
    } else if (myProfileError && confirmNewPassword !== newPassword) {
      setConfirmNewPasswordErrorMessage('Please make sure passwords match')
    } else {
      setConfirmNewPasswordErrorMessage('')
    }
  }, [confirmNewPassword, newPassword, password, email, myProfileError])

  useEffect(() => {
    setFirstName(userData?.firstName)
    setLastName(userData?.lastName)
    setEmail(userData?.email)
  }, [userData])

  return (
    <Box className="page-container">
      <Box className="page-padding">
        <Box className="page-heading ">My Profile</Box>
        <Box className="my-profile-container mt-40">
          {!showPasswords ? (
            <Box className="d-flex flex-column">
              <Box className={`${classes.marginTop26}`}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                  size="small"
                  value={firstName}
                  variant="outlined"
                  error={myProfileError && !firstName}
                  helperText={myProfileError && !firstName ? 'First Name is required' : ''}
                />
              </Box>
              <Box className={`${classes.marginTop26}`}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                  size="small"
                  value={lastName}
                  variant="outlined"
                  error={myProfileError && !lastName}
                  helperText={myProfileError && !lastName ? 'Last Name is required' : ''}
                />
              </Box>
              <Box className={`${classes.marginTop26}`}>
                <TextField
                  fullWidth
                  id="outlined-basic2"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="small"
                  variant="outlined"
                  error={!!(myProfileError && emailErrorMessage)}
                  helperText={emailErrorMessage}
                />
              </Box>
            </Box>
          ) : (
            <Box className={`d-flex flex-column ${classes.marginTop26}`}>
              <FormControl
                fullWidth
                error={!!(myProfileError && !password)}
                size="small"
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">Old Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  error={!!(myProfileError && !password)}
                  onChange={(e) => setPassword(e.target.value)}
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
                  label="Old Password"
                />
                <FormHelperText id="outlined-adornment-password">
                  {myProfileError && !password ? 'Password is required' : ''}
                </FormHelperText>
              </FormControl>
              <Box className={`${classes.marginTop26}`}>
                <FormControl
                  fullWidth
                  error={!!(myProfileError && !newPassword)}
                  size="small"
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                  <OutlinedInput
                    error={!!(myProfileError && !newPassword)}
                    id="outlined-adornment-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    {myProfileError && !newPassword ? 'New Password is required' : ''}
                  </FormHelperText>
                </FormControl>
              </Box>
              <Box className={`${classes.marginTop26}`}>
                <FormControl
                  fullWidth
                  error={!!(myProfileError && confirmNewPasswordErrorMessage)}
                  size="small"
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Confirm the new password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    error={!!(myProfileError && confirmNewPasswordErrorMessage)}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmNewPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm the new password"
                  />
                  <FormHelperText id="outlined-adornment-repeat-password">
                    {myProfileError && confirmNewPasswordErrorMessage}
                  </FormHelperText>
                </FormControl>
              </Box>
            </Box>
          )}
          <Box className="mt-26">
            <Button color="blue" onClick={() => setShowPasswords(!showPasswords)}>
              {!showPasswords ? 'Change Password' : 'Return Back'}
            </Button>
          </Box>
          {isLoading ? (
            <Box className="mt-20 d-flex justify-center">
              <CircularProgress />
            </Box>
          ) : (
            <Box className={classes.marginTop20}>
              <ButtonBlue handleClick={handleSave} title="Save" fullWidth />
            </Box>
          )}
          {errorMessage && <Box className="error-message">{errorMessage}</Box>}
          {success && (
            <Box className="success-message">Your user profile has been successfully updated</Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default MyProfile
