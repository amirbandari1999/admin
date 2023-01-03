import React, {useState} from 'react'
import {Box, CircularProgress, FormControl, FormHelperText, TextField} from '@mui/material'
import Stack from '@mui/material/Stack'
import {NavLink} from 'react-router-dom'
import MakeStyles from '../../assets/makeStyles/makeStyles'
import AuthenticationsApi from '../../api/authentication'
import Regex from '../../constants/regex'
import ButtonBlue from '../../layouts/buttons/buttonBlue'
import PopoverContainer from '../../layouts/popover/popover'
// import ButtonTranparentBorder from '../../layouts/buttons/buttonTransparentBorder'

const PasswordRecovery = () => {
  const classes = MakeStyles()
  const regEmail = Regex.email

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showPopover, setShowPopover] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleSendMeLink = () => {
    if (!email) {
      setErrorMessage('Email is required')
    } else if (!regEmail.test(email)) {
      setErrorMessage('Invalid Email')
    } else {
      ;(async () => {
        setIsLoading(true)

        const formData = new FormData()
        formData.append('Email', email)

        const response: any = await AuthenticationsApi.forgotPassword(formData)
        if (response.status === 200) {
          setErrorMessage('')
          setShowPopover(true)
        } else {
          setErrorMessage(response.response.data.message)
        }
        setIsLoading(false)
      })()
    }
  }

  const handleClosePopover = () => {
    setShowPopover(false)
  }

  return (
    <div>
      <PopoverContainer
        title="Email is successfully sent! Check your inbox."
        open={showPopover}
        onClose={handleClosePopover}
      />

      {/*{sendLink ? (*/}
      {/*  <Stack direction="column">*/}
      {/*    <p className="auth_title">Password Recovery</p>*/}
      {/*    <p className="auth_text">We sent you recovery link , check your inbox</p>*/}
      {/*    <Box className="d-flex mt-26">*/}
      {/*      <ButtonTranparentBorder*/}
      {/*        handleClick={() => setSendLink(false)}*/}
      {/*        title="RESEND"*/}
      {/*        width="width150"*/}
      {/*      />*/}
      {/*    </Box>*/}
      {/*  </Stack>*/}
      {/*) : (*/}
      <Stack direction="column">
        <p className="auth_title text-center">Welcome Back!</p>
        <p className="font-size-16 font-weight-500 mt-28 color-light-gray3">
          Enter your email for password recovery link
        </p>
        <Box className={classes.marginTop50}>
          <FormControl error={Boolean(errorMessage)} fullWidth>
            <TextField
              className={`${classes.w100} ${classes.inputStyle} ${classes.bgGray}`}
              size="small"
              fullWidth
              id="outlined-basic"
              label="Email"
              variant="outlined"
              value={email}
              error={Boolean(errorMessage)}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormHelperText>{errorMessage ?? ''}</FormHelperText>
          </FormControl>
        </Box>
        <Box className="mt-50">
          {isLoading ? (
            <Box className="d-flex justify-center">
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              <ButtonBlue fullWidth handleClick={handleSendMeLink} title="SEND" />
            </Box>
          )}
        </Box>
        <Box className="mt-20 font-weight-400 font-size-16 line-height-20 color-light-gray2">
          Do not have an account? <NavLink to="/sign-up">Sign up</NavLink>
        </Box>
      </Stack>
      {/*)}*/}
    </div>
  )
}

export default PasswordRecovery
