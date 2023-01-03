import React from 'react'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Box from '@mui/material/Box'
import {useStylesTable} from '../../../assets/makeStyles/table/table'
import BottomArrow from '../../../assets/images/Icons/bottomArrow'
import {
  ITableSuperAdminCell,
  ITableSuperAdminHeadProps,
} from '../../../shared/types/table/tableSuperAdmin/superAdmin'
import {ITableSuperAdmin} from '../../../shared/types/table/table'

const SuperAdminTableHead = (props: ITableSuperAdminHeadProps) => {
  const classesTable = useStylesTable()

  const {order, orderBy, onRequestSort} = props

  const createSortHandler =
    (property: keyof ITableSuperAdmin, sort: boolean) =>
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (sort) {
        onRequestSort(event, property)
      }
    }

  const headCellsSavedSubmissions: readonly ITableSuperAdminCell[] = [
    {
      id: 'email',
      numeric: true,
      disablePadding: false,
      label: 'Email',
      sortDropIconShow: true,
      show: true,
    },
    {
      id: 'firstName',
      numeric: true,
      disablePadding: false,
      label: 'First Name',
      sortDropIconShow: true,
      show: true,
    },
    {
      id: 'lastName',
      numeric: true,
      disablePadding: false,
      label: 'Last Name',
      sortDropIconShow: true,
      show: true,
    },
    {
      id: 'createdDate',
      numeric: true,
      disablePadding: false,
      label: 'Date / Time',
      sortDropIconShow: true,
      show: true,
    },
    {
      id: 'isActive',
      numeric: true,
      disablePadding: false,
      label: 'Activate / Deactivate',
      sortDropIconShow: true,
      show: true,
    },
  ]

  return (
    <TableHead className="table-head">
      <TableRow>
        {headCellsSavedSubmissions.map(
          (headCell) =>
            headCell.show && (
              <TableCell
                className={`${classesTable.tableHead}`}
                key={headCell.id}
                align={headCell.numeric ? 'right' : 'left'}
                padding={headCell.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <Box className="d-flex">
                  <Box
                    onClick={createSortHandler(headCell.id, headCell.sortDropIconShow)}
                    className="table-arrow-drop-container ml-16"
                  >
                    <Box className="text-left pr-10">{headCell.label}</Box>
                    {headCell.sortDropIconShow && (
                      <Box component="span" className="ml-14">
                        <BottomArrow />
                      </Box>
                    )}
                  </Box>
                </Box>
              </TableCell>
            ),
        )}
      </TableRow>
    </TableHead>
  )
}

export default SuperAdminTableHead
