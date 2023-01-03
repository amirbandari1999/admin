import React, {createContext, useContext, useState} from 'react'
import {IContextProps, IUserProps} from './userContext.props'
import {IUserData} from '../../shared/types/user/user'

const UserContext = createContext<IUserProps | null>(null)

const UserPageProvider = ({children}: IContextProps) => {
  const [userId, setUserId] = useState<number>(Number(localStorage.userId))
  const [email, setEmail] = useState<string>('')
  const [accessToken, setAccessToken] = useState<string | undefined>(localStorage.accessToken)
  const [adminId, setAdminId] = useState<number>(0)
  const [userData, setUserData] = useState<IUserData | null>()
  const [role, setRole] = useState<string | number>(Number(localStorage.role))
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false)
  const [signedUp, setSignedUp] = useState<boolean>(false)
  const contextValues = React.useMemo(
    () => ({
      email,
      setEmail,
      userId,
      setUserId,
      accessToken,
      setAccessToken,
      adminId,
      setAdminId,
      userData,
      setUserData,
      role,
      setRole,
      isLoadingPage,
      setIsLoadingPage,
      setSignedUp,
      signedUp,
    }),
    [email, userId, accessToken, adminId, userData, role, isLoadingPage, signedUp],
  )

  return <UserContext.Provider value={contextValues}>{children}</UserContext.Provider>
}

export default UserPageProvider
export const UseUserContext = () => useContext(UserContext)
