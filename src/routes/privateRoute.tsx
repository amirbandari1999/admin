import React, {useEffect} from 'react'
import {Navigate, Outlet, useLocation} from 'react-router-dom'
import {useNavigate} from 'react-router'
import {isAuthenticated} from '../pages/utils'
import Sidebar from '../layouts/sidebar'
import CreateEventContext from '../context/createEventContext/createEventContext'
import EvaluationContext from '../context/evalaution/evaluationContext'
import SidebarSuperAdmin from '../layouts/sidebarSuperAdmin'
import {UseUserContext} from '../context/userContext/userContext'
import {IUserProps} from '../context/userContext/userContext.props'
import UsersApi from '../api/users'
import {UseSuperAdminContext} from '../context/superAdminContext/superAdminContext'
import {ISuperAdminProps} from '../context/superAdminContext/superAdminContext.props'

const PrivateRoute = () => {
  const {setRole, role, setUserData, userId} = UseUserContext() as IUserProps
  const {setIsLoadingSuperAdmin, setRowsOfTable} = UseSuperAdminContext() as ISuperAdminProps
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setIsLoadingSuperAdmin(true)
    if (userId && role) {
      ;(async () => {
        if (role !== 2) {
          const response2 = await UsersApi.userList(userId)
          if (response2.status === 200) {
            setRole(response2.data.role)
            setUserData(response2.data)
            if (!location.pathname) {
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
    }
    setIsLoadingSuperAdmin(false)
  }, [userId, role])

  if (isAuthenticated()) {
    if (role === 2) {
      return (
        <>
          <SidebarSuperAdmin />
          <Outlet />
        </>
      )
    }
    return (
      <>
        <Sidebar />
        <EvaluationContext>
          <CreateEventContext>
            <Outlet />
          </CreateEventContext>
        </EvaluationContext>
      </>
    )
  }
  return <Navigate to="/sign-in" />
}

export default PrivateRoute
