import React, {useEffect, useState} from 'react'
import {Box, CircularProgress} from '@mui/material'
import Stack from '@mui/material/Stack'
import {useSearchParams} from 'react-router-dom'
import {useLocation, useNavigate} from 'react-router'
import AuthBG from '../../assets/images/authBG'
import SignUpIllu1 from '../../assets/images/signUpIllu1'
import SignUpIllu2 from '../../assets/images/signUpIllu2'
import AuthenticationsApi from '../../api/authentication'

const SignUpConfirmation = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const userToken = searchParams.get('user_token')

    ;(async () => {
      await AuthenticationsApi.signUpConfirmation(userToken)
      navigate('/sign-in')
      setIsLoading(false)
    })()
  }, [location])

  return (
    <div className="container auth-container">
      <div className="auth-content_wrapper">
        <div className="auth-content_bg">
          <AuthBG />
        </div>
        <div className="auth_content">
          <Stack direction="column">
            <Box className="auth_title mt-52">Sign up confirmation</Box>
            {isLoading && (
              <Box className="m-auto mt-60">
                <CircularProgress />
              </Box>
            )}
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

export default SignUpConfirmation
