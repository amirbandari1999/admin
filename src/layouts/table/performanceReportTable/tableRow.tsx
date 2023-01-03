import React, {Fragment, useState} from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import {Box, Button} from '@mui/material'
import moment from 'moment'
import CircularProgress from '@mui/material/CircularProgress'
import {AxiosResponse} from 'axios'
import MakeStyles from '../../../assets/makeStyles/makeStyles'
import {useStylesTable} from '../../../assets/makeStyles/table/table'
import {IEnhancedPerformanceReportTableRows} from '../../../shared/types/table/table'
import {UseCertificateContext} from '../../../context/certificateContext/certificateContext'
import {ICertificateProps} from '../../../context/certificateContext/certificateContext.props'
import ReportsApi from '../../../api/reports'
import {IEvaluationPersonalFormReport} from '../../../shared/types/modal/evaluationPersonalModal'
import EvaluateePersonalModal from '../../modal/evaluateePersonalModal'

const PerformanceReportTableRow = ({
  key,
  labelId,
  row,
}: {
  key: number
  labelId: string
  row: IEnhancedPerformanceReportTableRows
}) => {
  const classes = MakeStyles()
  const classesTable = useStylesTable()
  const {
    setShowCertificate,
    setEvaluateeName,
    setMenual,
    setCreateDate,
    setTotalScore,
    setEvaluateeId,
    // noScore,
  } = UseCertificateContext() as unknown as ICertificateProps
  const {
    eventTitle,
    evaluateeName,
    evaluateePosition,
    hireDate,
    // questionCount,
    monthlySalary,
    currency,
    evaluateeId,
    bonusPercentage,
    averagePoint,
  } = row

  const [openModal, setOpenModal] = useState<boolean>(false)
  const [evaluationPersonalData, setEvaluationPersonalData] =
    useState<IEvaluationPersonalFormReport>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleShowCertificate = (evaluateeNameProps: string, pointProps: string) => {
    setShowCertificate(true)
    setTotalScore(pointProps)
    setMenual(false)
    setCreateDate(moment(hireDate).calendar())
    setEvaluateeId(evaluateeId)
    setEvaluateeName(evaluateeNameProps)
  }

  // const renderRatingWithText = () => {
  //   if (averagePoint / questionCount <= 1) {
  //     return 'Good'
  //   }
  //   if (averagePoint / questionCount <= 2) {
  //     return 'Good'
  //   }
  //   return 'Excellent'
  // }

  const closeModal = () => {
    setOpenModal(false)
  }

  const handleGenerateReport = async () => {
    setIsLoading(true)
    setOpenModal(true)
    const response = await ReportsApi.getEvaluationPersonalFormReport({
      eventId: row.eventId,
      evaluateeId: row.evaluateeId,
    })
    setEvaluationPersonalData(response.data)
    setIsLoading(false)
  }

  const handleGenerateReportQuestion = async () => {
    await ReportsApi.createPdfReportEvaluationByQuestion({
      eventId: row.eventId,
      evaluateeId: row.evaluateeId,
    }).then((response: AxiosResponse) => {
      const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'EvaluationByQuestionReport.pdf')
      document.body.appendChild(link)
      link.click()
    })
  }

  return (
    <Fragment key={key}>
      <TableRow key={row.id} hover tabIndex={-1}>
        <TableCell className={classesTable.tableBodyReport} id={labelId}>
          <Box className={`${classes.pLeft16}`}>{eventTitle}</Box>
        </TableCell>
        <TableCell
          className={classesTable.tableBodyReport}
          component="th"
          id={labelId}
          scope="row"
          padding="none"
        >
          <Box className={`${classes.pLeft16}`}>{evaluateeName}</Box>
        </TableCell>
        <TableCell key="dueDate" id="dueDate" className={classesTable.tableBodyReport}>
          <Box className={`${classes.pLeft16}`}>{hireDate && moment(hireDate).format('L')}</Box>
        </TableCell>
        <TableCell key="averagePoint" className={classesTable.tableBodyReport}>
          <Box className={`${classes.pLeft16}`}>{evaluateePosition}</Box>
        </TableCell>
        <TableCell className={classesTable.tableBodyReport}>
          <Box className={`${classes.pLeft16}`}>
            {monthlySalary}
            {currency === 1 ? ' AMD' : ' USD'}
          </Box>
        </TableCell>
        {/* {!noScore && ( */}
        <TableCell className={classesTable.tableBodyReport}>
          <Box className={`${classes.pLeft16}`}>
            {/* {noScore ? renderRatingWithText() : averagePoint} */}
            {averagePoint}
          </Box>
        </TableCell>
        {/* )} */}
        <TableCell className={classesTable.tableBodyReport}>
          <Box className={`${classes.pLeft16} pb-10 pt-10`}>{bonusPercentage % 100}</Box>
        </TableCell>
        <TableCell className={classesTable.tableBodyReport}>
          <Box className={`${classes.pLeft16}`}>
            {(monthlySalary * bonusPercentage) / 100} {currency === 1 ? ' AMD' : ' USD'}
          </Box>
        </TableCell>
        <TableCell className={classesTable.tableBodyReport}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Box>
              <Box className={`${classes.pLeft16}`}>
                <Button color="blue" variant="text" onClick={() => handleGenerateReport()}>
                  Generate Report
                </Button>
              </Box>
              <Box className={`${classes.pLeft16}`}>
                <Button
                  color="blue"
                  variant="text"
                  onClick={() =>
                    handleShowCertificate(
                      evaluateeName,
                      averagePoint.toString(),
                      // (averagePoint / questionCount).toString().slice(0, 4),
                    )
                  }
                >
                  GET CERTIFICATE
                </Button>
              </Box>
              <Box className={`${classes.pLeft16}`}>
                <Button color="blue" variant="text" onClick={() => handleGenerateReportQuestion()}>
                  Generate Dot818 Report
                </Button>
              </Box>
            </Box>
          )}
        </TableCell>
      </TableRow>

      {evaluationPersonalData && (
        <EvaluateePersonalModal
          data={evaluationPersonalData}
          openModal={openModal}
          closeModal={closeModal}
          evaluateeId={row.evaluateeId}
          eventId={row.eventId}
          eventTitle={row.eventTitle}
        />
      )}
    </Fragment>
  )
}
export default PerformanceReportTableRow
