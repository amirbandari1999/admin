import React, {createContext, useContext, useState} from 'react'
import {IContextProps, ISuperAdminProps} from './superAdminContext.props'
import {ITableSuperAdmin} from '../../shared/types/table/table'

const SuperAdminContext = createContext<ISuperAdminProps | null>(null)

const SuperAdminPageProvider = ({children}: IContextProps) => {
  const [isLoadingSuperAdmin, setIsLoadingSuperAdmin] = useState(false)
  const [rowsOfTable, setRowsOfTable] = useState<ITableSuperAdmin[] | undefined>([])

  const contextValues = React.useMemo(
    () => ({
      isLoadingSuperAdmin,
      setIsLoadingSuperAdmin,
      rowsOfTable,
      setRowsOfTable,
    }),
    [isLoadingSuperAdmin, rowsOfTable],
  )

  return <SuperAdminContext.Provider value={contextValues}>{children}</SuperAdminContext.Provider>
}

export default SuperAdminPageProvider
export const UseSuperAdminContext = () => useContext(SuperAdminContext)
