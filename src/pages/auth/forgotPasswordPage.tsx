import React from 'react'
import {useNavigate} from 'react-router'
import {Box} from '@mui/material'
import CloseIcon from '../../assets/images/Icons/closeIcon'
import AuthBG from '../../assets/images/authBG'
import PassRecov1 from '../../assets/images/passRecov1'
import PassRecov2 from '../../assets/images/passRecov2'
import PasswordRecovery from './passwordRecovery'

const ForgotPasswordPage = () => {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/sign-in')
  }

  return (
    <div className="container auth-container">
      <div className="auth-content_wrapper">
        <div className="auth-content_bg">
          <AuthBG />
        </div>
        <div className="auth_content">
          <div className="auth-close">
            <Box className="cursor-pointer" onClick={handleClose}>
              <CloseIcon color="#4F4F4F" />
            </Box>
          </div>
          <div className="forgot-password-container">
            <PasswordRecovery />
          </div>
        </div>
      </div>
      <div className="auth-image_wrapper">
        <PassRecov1 />
        <PassRecov2 />
      </div>
    </div>
  )
}

export default ForgotPasswordPage
