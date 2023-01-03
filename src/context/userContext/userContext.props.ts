import React, {Dispatch} from 'react'
import {IUserData} from '../../shared/types/user/user'

export interface IUserProps {
  userId: number
  setUserId: Dispatch<React.SetStateAction<number>>
  email: string
  setEmail: Dispatch<React.SetStateAction<string>>
  accessToken: string | undefined
  setAccessToken: Dispatch<React.SetStateAction<string | undefined>>
  userData: IUserData | null | undefined
  setUserData: Dispatch<React.SetStateAction<IUserData | null | undefined>>
  role: string | number
  setRole: Dispatch<React.SetStateAction<string | number>>
  isLoadingPage: boolean
  setIsLoadingPage: Dispatch<React.SetStateAction<boolean>>
  signedUp: boolean
  setSignedUp: Dispatch<React.SetStateAction<boolean>>
}

export interface IContextProps {
  children?: JSX.Element | JSX.Element[]
}
