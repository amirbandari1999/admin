import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import React from 'react'
import {TableContainer} from '@mui/material'
import {useStylesTable} from '../../../assets/makeStyles/table/table'
import SuperAdminTableHead from './tableHead'
import SuperAdminTableRow from './tableRow'
import {ITableContainerSuperAdminProps} from '../../../shared/types/table/tableSuperAdmin/superAdmin'

const TableContainerSuperAdmin = ({
  order,
  orderBy,
  handleRequestSort,
  stableSort,
  rows,
  getComparator,
}: ITableContainerSuperAdminProps) => {
  const classesTable = useStylesTable()

  return (
    <TableContainer className={`${classesTable.tableContainer}`}>
      <Table aria-labelledby="tableTitle">
        <SuperAdminTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          rowCount={rows ? rows.length : 0}
        />
        {rows && (
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`
              return <SuperAdminTableRow row={row} key={index} labelId={labelId} />
            })}
          </TableBody>
        )}
      </Table>
    </TableContainer>
  )
}
export default TableContainerSuperAdmin
