import React, {Dispatch} from 'react'
import {ITableSuperAdmin} from '../../shared/types/table/table'

export interface ISuperAdminProps {
  isLoadingSuperAdmin: boolean
  setIsLoadingSuperAdmin: Dispatch<React.SetStateAction<boolean>>
  rowsOfTable: ITableSuperAdmin[] | undefined
  setRowsOfTable: Dispatch<React.SetStateAction<ITableSuperAdmin[] | undefined>>
}

export interface IContextProps {
  children?: JSX.Element | JSX.Element[]
}
