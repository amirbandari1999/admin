import React, {useEffect} from 'react'
import {Navigate, Outlet} from 'react-router-dom'
import {useLocation, useNavigate} from 'react-router'
import {isAuthenticated} from '../pages/utils'
import RateSidebar from '../layouts/rateEvaluateSidebar'
import FeedbackContext from '../context/feedbackContext/feedbackContext'
import EvaluationContext from '../context/evalaution/evaluationContext'
import {UseUserContext} from '../context/userContext/userContext'
import {IUserProps} from '../context/userContext/userContext.props'
import UsersApi from '../api/users'
import {UseSuperAdminContext} from '../context/superAdminContext/superAdminContext'
import {ISuperAdminProps} from '../context/superAdminContext/superAdminContext.props'

const PublicRoute = () => {
  const {setRole, role, userData, setUserData, userId, setIsLoadingPage} =
    UseUserContext() as IUserProps
  const location = useLocation()
  const {setIsLoadingSuperAdmin, setRowsOfTable} = UseSuperAdminContext() as ISuperAdminProps
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoadingSuperAdmin(true)
    if (localStorage.getItem('userId') && role && !userData) {
      ;(async () => {
        if (role !== 2) {
          const response2 = await UsersApi.userList(userId)
          if (response2.status === 200) {
            setRole(response2.data.role)
            setUserData(response2.data)
            if (location.pathname !== '/Evaluation/getEventForEvaluation') {
              navigate('/events')
            }
          }
        } else {
          const response2 = await UsersApi.getSuperAdminUser(userId)
          if (response2.status === 200) {
            setRole(response2.data.role)
            setUserData(response2.data)
            const response3 = await UsersApi.getAccounts()
            setRowsOfTable(response3.data)
            if (location.pathname !== '/Evaluation/getEventForEvaluation') {
              navigate('/super-admin')
            }
          }
        }
      })()
      setIsLoadingSuperAdmin(false)
    }
    setIsLoadingPage(false)
  }, [userId, role])

  if (location.pathname !== '/Evaluation/getEventForEvaluation') {
    if (!isAuthenticated()) {
      return <Outlet />
    }
    return <Navigate to="/events" />
  }
  return (
    <EvaluationContext>
      <FeedbackContext>
        <RateSidebar />
        <Outlet />
      </FeedbackContext>
    </EvaluationContext>
  )
}

export default PublicRoute
