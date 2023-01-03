import React, {Fragment, useEffect, useState} from 'react'
import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import moment from 'moment'
import {Button, CircularProgress} from '@mui/material'
import {useStylesTable} from '../../../assets/makeStyles/table/table'
import UsersApi from '../../../api/users'
import {TableKeyNumberOrStringType} from '../../../shared/types/table/table'

const SuperAdminTableRow = ({
  key,
  labelId,
  row,
}: {
  key: number
  labelId: string
  row: TableKeyNumberOrStringType
}) => {
  const classesTable = useStylesTable()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<TableKeyNumberOrStringType>()

  useEffect(() => {
    setData(row)
  }, [row])

  const handleSwitchActiveAccount = async () => {
    setIsLoading(true)
    const response = await UsersApi.switchActiveAccount(row.id)

    if (response.status === 200) {
      setData(response.data)
    }

    setIsLoading(false)
  }

  return (
    <Fragment key={key}>
      <TableRow key={data?.id} hover tabIndex={-1}>
        <TableCell className={classesTable.tableBodyEvents} id={labelId}>
          <Box className="ml-16 break-all">{data?.email}</Box>
        </TableCell>
        <TableCell className={classesTable.tableBodyEvents}>{data?.firstName}</TableCell>
        <TableCell className={classesTable.tableBodyEvents}>{data?.lastName}</TableCell>
        <TableCell className={classesTable.tableBodyEvents}>
          {moment(data?.createdDate).format('YYYY-MM-DD HH:mm:ss')}
        </TableCell>
        <TableCell className={classesTable.tableBodyEvents}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button onClick={() => handleSwitchActiveAccount()}>
              {!data?.isActive ? 'Activate' : 'Deactivate'}
            </Button>
          )}
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
export default SuperAdminTableRow
