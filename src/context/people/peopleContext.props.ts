import React, {Dispatch} from 'react'
import {IUsers} from '../../shared/types/user/user'

export interface IPeopleProps {
  users: IUsers[]
  setUsers: Dispatch<React.SetStateAction<IUsers[]>>
  page: number
  setPage: Dispatch<React.SetStateAction<number>>
  pageSize: number
  setPageSize: Dispatch<React.SetStateAction<number>>
  limitData: number | undefined
  setLimitData: Dispatch<React.SetStateAction<number | undefined>>
  isLoadingOfPeople: boolean
  setIsLoadingOfPeople: Dispatch<React.SetStateAction<boolean>>
}

export interface IContextProps {
  children?: JSX.Element | JSX.Element[]
}
