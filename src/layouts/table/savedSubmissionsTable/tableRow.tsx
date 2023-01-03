import React, {Fragment, useEffect, useState} from 'react'
import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
// import {styled} from '@mui/material/styles'
import moment from 'moment'
import {Link} from 'react-router-dom'
import CircleIcon from '@mui/icons-material/Circle'
// import MakeStyles from '../../../assets/makeStyles/makeStyles'
import {useStylesTable} from '../../../assets/makeStyles/table/table'
import {TableKeyNumberOrStringType} from '../../../shared/types/table/table'
import CollapseRowCloseIcon from '../../../assets/images/Icons/collapsableRowCloseIcon'
import CollapsableRowOpenIcon from '../../../assets/images/Icons/collapsableRowOpenIcon'
import {ISavedSubmissionsOfTable} from '../../../shared/types/events/events'
import {UseEvaluationContext} from '../../../context/evalaution/evaluationContext'
import {IEvalautionProps} from '../../../context/evalaution/evaluationContext.props'
import useStylesIcon from '../../../assets/makeStyles/icons/icons'
// import useStyles from '../../../assets/makeStyles/evaluatorsStep/evaluatorsStep'

// const StyledTableRow = styled(TableRow)(() => ({
//   '&:nth-of-type(even)': {
//     backgroundColor: '#F7FBFF',
//   },
// }))

const SavedSubmissionsTableRow = ({
  key,
  labelId,
  // handleClick,
  // isItemSelected,
  row,
}: {
  key: number
  labelId: string
  // handleClick: (event: React.MouseEvent<HTMLElement>, id: number) => void
  // isItemSelected: boolean
  row: TableKeyNumberOrStringType
}) => {
  // const classes = MakeStyles()
  const classesTable = useStylesTable()
  const stylesIcon = useStylesIcon()
  // const styles = useStyles()

  const {eventTitle, eventId, evaluatorName, evaluateeName, createdDate} =
    row as unknown as ISavedSubmissionsOfTable

  const [open, setOpen] = useState(false)
  const [openFeedback, setOpenFeedback] = useState(false)
  const [usersOfEvaluation, setUsersOfEvaluation] = useState<
    {
      eventId: number
      evaluatee: {firstName: string}
      question: {questionTitle: string}
      point: number
      event: {id: number | undefined}
    }[]
  >([])
  const [feedbacks, setFeedbacks] = useState<
    {
      evaluatee: {firstName: string}
      feedbackText: string
    }[]
  >([])

  const {getEvaluationList, evaluationPointSumReportList, feedbacksList} =
    UseEvaluationContext() as IEvalautionProps

  useEffect(() => {
    const updateUsersOfEvaluation =
      getEvaluationList &&
      getEvaluationList
        .filter((item) => {
          if (item.event.id === eventId) {
            return true
          }
          return false
        })
        .map((item) => item)
    setUsersOfEvaluation(updateUsersOfEvaluation)
  }, [getEvaluationList])

  useEffect(() => {
    const updateFeedbacks = feedbacksList
      .filter((item) => {
        if (item.event.id === eventId) {
          return true
        }
        return false
      })
      .map((item) => item)
    setFeedbacks(updateFeedbacks)
  }, [feedbacksList])

  const handleOpenFeedback = () => {
    setOpenFeedback(!openFeedback)
    setOpen(false)
  }

  const handleOpenEvaluationCriteriaScore = () => {
    setOpenFeedback(false)
    setOpen(!open)
  }

  return (
    <Fragment key={key}>
      <TableRow
        key={row.id}
        // aria-checked={isItemSelected}
        hover
        tabIndex={-1}
      >
        <TableCell className={classesTable.tableBodyEvents} id={labelId}>
          {/*<FormGroup>*/}
          {/*  <FormControlLabel*/}
          {/*    control={*/}
          {/*      <Checkbox*/}
          {/*        color="default"*/}
          {/*        className={`${classes.colorGray}`}*/}
          {/*        onClick={(event) => handleClick(event, Number(row.id))}*/}
          {/*        checked={isItemSelected}*/}
          {/*      />*/}
          {/*    }*/}
          {/*    label={<Box className={`ml-24 ${classesTable.tableTextStyle}`}>{eventTitle}</Box>}*/}
          {/*  />*/}
          {/*</FormGroup>*/}
          <Box className="ml-16 break-all">{eventTitle}</Box>
        </TableCell>
        <TableCell className={classesTable.tableBodyEvents}>{evaluatorName}</TableCell>
        <TableCell className={`${classesTable.tableBodyEvents}`}>
          <Box className="d-flex align-center">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => handleOpenEvaluationCriteriaScore()}
            >
              {open ? <CollapseRowCloseIcon /> : <CollapsableRowOpenIcon />}
            </IconButton>
            {usersOfEvaluation && usersOfEvaluation.length
              ? evaluationPointSumReportList.map(
                  (item) =>
                    item.eventId === eventId && (
                      <Box className="pl-10 pr-10 pb-10">
                        {item.evaluatorName} -{' '}
                        {item.sumPoint !== 0
                          ? (item.sumPoint / item.questionCount).toString().slice(0, 4)
                          : 0}
                      </Box>
                    ),
                )
              : 'there is not data'}
          </Box>
        </TableCell>
        <TableCell className={classesTable.tableBodyEvents}>{evaluateeName}</TableCell>
        <TableCell className={classesTable.tableBodyEvents}>
          {moment(createdDate).format('LLL')}
        </TableCell>
        <TableCell className={`${classesTable.tableBodyEvents}`}>
          <Box className="d-flex align-center">
            <IconButton aria-label="expand row" size="small" onClick={() => handleOpenFeedback()}>
              {openFeedback ? <CollapseRowCloseIcon /> : <CollapsableRowOpenIcon />}
            </IconButton>
            <Box className="table-string-ellipse">
              <Link
                to={{
                  pathname: '/reports',
                  search: '?fromSavedSubmissions',
                }}
                className={`text-decoration-none ${classesTable.lightBlueText}`}
              >
                {feedbacks.length
                  ? feedbacks.map(
                      (item, index: number) =>
                        item &&
                        `${(index ? ', ' : '') + item.evaluatee.firstName} - ${item.feedbackText}
                     `,
                    )
                  : 'there is not data'}
              </Link>
            </Box>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{padding: 0, border: 0}} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="collapse-table-container d-flex flex-column mb-10">
              {usersOfEvaluation && usersOfEvaluation.length
                ? usersOfEvaluation.map(
                    (item) =>
                      item && (
                        <Box className="mb-10 d-flex align-center">
                          <Box className={`${stylesIcon.smallIcon} mr-10`}>
                            <CircleIcon fontSize="small" />
                          </Box>
                          {'   '}
                          {` ${item.evaluatee.firstName} - ${item.question.questionTitle} - ${item.point}`}
                        </Box>
                      ),
                  )
                : 'there is not data'}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{padding: 0, border: 0}} colSpan={7}>
          <Collapse in={openFeedback} timeout="auto" unmountOnExit>
            <Box className="collapse-table-container d-flex flex-column">
              {feedbacks.length
                ? feedbacks.map(
                    (item) =>
                      item && (
                        <Box className="mb-10 d-flex align-center">
                          <Box className={`${stylesIcon.smallIcon} mr-10`}>
                            <CircleIcon fontSize="small" />
                          </Box>
                          {item.evaluatee.firstName} - {item.feedbackText}
                        </Box>
                      ),
                  )
                : 'there is not data'}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}
export default SavedSubmissionsTableRow
