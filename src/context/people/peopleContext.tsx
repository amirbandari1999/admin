import React, {createContext, useContext, useState} from 'react'
import {IContextProps, IPeopleProps} from './peopleContext.props'
import {IUsers} from '../../shared/types/user/user'

const PeopleContext = createContext<IPeopleProps | null>(null)

const PeoplePageProvider = ({children}: IContextProps) => {
  const [users, setUsers] = useState<IUsers[]>([])
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [limitData, setLimitData] = useState<number | undefined>()
  const [isLoadingOfPeople, setIsLoadingOfPeople] = useState<boolean>(false)

  const contextValues = React.useMemo(
    () => ({
      users,
      setUsers,
      page,
      setPage,
      pageSize,
      setPageSize,
      limitData,
      setLimitData,
      isLoadingOfPeople,
      setIsLoadingOfPeople,
    }),
    [users, isLoadingOfPeople, limitData, pageSize, page],
  )

  return <PeopleContext.Provider value={contextValues}>{children}</PeopleContext.Provider>
}

export default PeoplePageProvider
export const UsePeopleContext = () => useContext(PeopleContext)
