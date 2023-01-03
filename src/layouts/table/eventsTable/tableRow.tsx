import TableCell from '@mui/material/TableCell'
import Box from '@mui/material/Box'
import {useNavigate} from 'react-router-dom'
import TableRow from '@mui/material/TableRow'
import React, {useState} from 'react'
import moment from 'moment'
import {
  IEnhancedTemplatesTableRows,
  TableKeyNumberOrStringType,
} from '../../../shared/types/table/table'
import {useStylesTable} from '../../../assets/makeStyles/table/table'
import DeleteModal from '../../modal/deleteModal'
import EventsApi from '../../../api/events'
import ButtonTransparent from '../../buttons/buttonTransparent'
// import {IEventEvaluators} from '../../../shared/types/events/events'
// import getUserList from '../../../pages/utils/usersUtils'

const EventsTableRow = ({
  key,
  labelId,
  row,
}: {
  key: number
  labelId: string
  row: TableKeyNumberOrStringType | IEnhancedTemplatesTableRows
}) => {
  const classesTable = useStylesTable()

  const [deleteModal, setDeleteModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const navigate = useNavigate()
  // const eventEvaluators = row?.eventEvaluators as IEventEvaluators[]
  // const eventEvaluatees = row?.eventEvaluatees as IEventEvaluators[]
  const {admin, evaluatees, evaluators} = row as IEnhancedTemplatesTableRows

  // const [getEvaluateeUsers, setGetEvaluateeUsers] = useState<{id: number; userName: string}[]>([])
  // const [getEvaluatorUsers, setGetEvaluatorUsers] = useState<{id: number; userName: string}[]>([])

  const {firstName} = admin

  const handleSeeReport = (id: number | string) => {
    navigate(`/events/event-create/${id}`, {state: {isAdminLocation: true, id, view: true}})
  }

  const handleClone = (id: number | string) => {
    navigate(`/events/event-create/${id}`, {state: {isAdminLocation: true, id, clone: true}})
  }

  const handleEdit = (id: number | string) => {
    navigate(`/events/event-create/${id}`, {state: {isAdminLocation: true, id, edit: true}})
  }

  // useEffect(() => {
  //   ;(async () => {
  //     const updateEvaluatorUsers = await Promise.all(
  //       eventEvaluators.map(async (item) => getUserList(item)),
  //     )
  //     const updateEvaluateeUsers = await Promise.all(
  //       eventEvaluatees.map(async (item) => getUserList(item)),
  //     )
  //     setGetEvaluatorUsers(updateEvaluatorUsers)
  //     setGetEvaluateeUsers(updateEvaluateeUsers)
  //   })()
  // }, [eventEvaluators, eventEvaluatees])

  const handleDelete = async () => {
    setIsLoading(true)
    const response = await EventsApi.deleteEvent(row.id)
    if (response.status === 200) {
      window.location.reload()
    } else {
      setError(true)
    }
    setIsLoading(false)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModal(false)
    setError(false)
  }

  const handleOpenDeleteModal = () => {
    setDeleteModal(true)
    setError(false)
  }

  return (
    <TableRow hover tabIndex={-1} key={key}>
      <TableCell className={`${classesTable.tableBodyEvents} break-all`} id={labelId}>
        {row.eventTitle}
      </TableCell>
      <TableCell className={classesTable.tableBodyEvents}>{firstName}</TableCell>
      <TableCell className={classesTable.tableBodyEvents}>
        {row.createdDate && moment(row.createdDate).format('L')}
      </TableCell>
      <TableCell className={classesTable.tableBodyEvents}>
        {evaluators &&
          evaluators.map((item, index) => item && (index ? ', ' : '') + item.firstName)}
      </TableCell>
      <TableCell className={`${classesTable.tableBodyEvents}`}>
        {evaluatees &&
          evaluatees.map((item, index) => item && (index ? ', ' : '') + item.firstName)}
      </TableCell>
      <TableCell className={classesTable.tableBodyEvents}>
        <Box component="span">
          <ButtonTransparent
            handleClick={() => handleSeeReport(row.id)}
            title="View"
            color="colorLightBlue"
          />
        </Box>
        <Box component="span">
          <ButtonTransparent
            handleClick={() => handleEdit(row.id)}
            title="Edit"
            color="colorLightBlue"
          />
        </Box>
        <Box component="span">
          <ButtonTransparent
            handleClick={() => handleClone(row.id)}
            title="Clone"
            color="colorLightBlue"
          />
        </Box>
        <Box component="span">
          <ButtonTransparent
            handleClick={handleOpenDeleteModal}
            title="Delete"
            color="colorLightBlue"
          />
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

export default EventsTableRow
