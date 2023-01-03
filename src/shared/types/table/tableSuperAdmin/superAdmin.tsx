import React, {Key} from 'react'
import {
  ITableSuperAdmin,
  StableSortArrayType,
  TableArraysType,
  TableKeyNumberOrStringType,
  TableOrderType,
} from '../table'

export interface ITableContainerSuperAdminProps {
  order: TableOrderType
  orderBy: keyof ITableSuperAdmin
  handleRequestSort: (
    event: React.MouseEvent<HTMLDivElement>,
    property: keyof ITableSuperAdmin,
  ) => void
  stableSort: <T>(
    array: StableSortArrayType,
    comparator: (a: T | TableKeyNumberOrStringType, b: T | TableKeyNumberOrStringType) => number,
  ) => T[]
  rows: TableArraysType
  getComparator: (
    order: TableOrderType,
    orderBy: Key,
  ) => (a: TableKeyNumberOrStringType, b: TableKeyNumberOrStringType) => number
}

export interface ITableSuperAdminHeadProps {
  onRequestSort: (event: React.MouseEvent<HTMLDivElement>, property: keyof ITableSuperAdmin) => void
  order: TableOrderType
  orderBy: string
  rowCount: number
}

export interface ITableSuperAdminCell {
  disablePadding: boolean
  id: keyof ITableSuperAdmin
  label: string
  numeric: boolean
  sortDropIconShow: boolean
  borderRight?: boolean
  show: boolean
}
