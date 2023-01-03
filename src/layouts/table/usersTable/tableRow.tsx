import TableCell from '@mui/material/TableCell'
import {useNavigate} from 'react-router-dom'
import {Box, TableRow} from '@mui/material'
import React, {useState} from 'react'
import {TableKeyNumberOrStringType} from '../../../shared/types/table/table'
import {useStylesTable} from '../../../assets/makeStyles/table/table'
import EditIcon from '../../../assets/images/Icons/editIcon_2'
import DeleteIcon from '../../../assets/images/Icons/deleteIcon'
import UsersApi from '../../../api/users'
import DeleteModal from '../../modal/deleteModal'
import {UsePeopleContext} from '../../../context/people/peopleContext'
import {IPeopleProps} from '../../../context/people/peopleContext.props'
import {ISliderStatus} from '../../../shared/types/slider/slider'

const UsersTableRow = ({
  key,
  labelId,
  row,
}: {
  key: number
  labelId: string
  row: TableKeyNumberOrStringType
}) => {
  const classesTable = useStylesTable()
  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const navigate = useNavigate()
  const {setUsers, setIsLoadingOfPeople, setLimitData, page, pageSize} =
    UsePeopleContext() as IPeopleProps

  const handleEdit = (values: TableKeyNumberOrStringType) => {
    navigate(`user-edit/${values.id}`, {state: values})
  }

  const handleOpenDeleteModal = () => {
    setDeleteModal(true)
    setError(false)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModal(false)
    setError(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const response = await UsersApi.deleteUser(row.id)
    if (response.status === 200) {
      setIsLoadingOfPeople(true)
      const response2 = await UsersApi.getUsersPagination(page, pageSize)
      const updateUsers = response2.data.users.map((item: ISliderStatus[]) => item)
      setLimitData(response2.data.totalUsersCount)
      setUsers(updateUsers)
      setIsLoadingOfPeople(false)
    } else {
      setError(true)
    }
    setIsLoading(false)
  }

  return (
    <TableRow hover tabIndex={-1} key={key}>
      <TableCell className={classesTable.tableBodyEvents} id={labelId}>
        {row.firstName}
      </TableCell>
      <TableCell className={classesTable.tableBodyEvents}>{row.email}</TableCell>
      <TableCell className={classesTable.tableBodyEvents}>{row.position}</TableCell>
      <TableCell
        className={`${classesTable.tableBodyEvents} `}
        // className={`${classesTable.tableBodyUsers} ${classesTable.tableRowDisFlex}`}
      >
        {row.monthlySalary} {row.currency === 1 ? 'AMD' : 'USD'}
      </TableCell>
      <TableCell className={`${classesTable.tableBodyEvents}`}>
        <Box className="d-flex align-center">
          <Box className="cursor-pointer ml-14" onClick={() => handleEdit(row)}>
            <EditIcon />
          </Box>
          <Box className="cursor-pointer ml-14" onClick={() => handleOpenDeleteModal()}>
            <DeleteIcon />
          </Box>
        </Box>
      </TableCell>
      <DeleteModal
        closeModal={handleCloseDeleteModal}
        openModal={deleteModal}
        handleDelete={handleDelete}
        isLoading={isLoading}
        error={error}
      />
    </TableRow>
  )
}

export default UsersTableRow
