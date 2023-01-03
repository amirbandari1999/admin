import React, {useEffect, useState} from 'react'
import {Box, CircularProgress} from '@mui/material'
import {AxiosResponse} from 'axios'
import moment from 'moment'
import EnhancedTable from '../../layouts/table/table'
import {TableArraysType} from '../../shared/types/table/table'
import UsersApi from '../../api/users'
import EvaluationApi from '../../api/evaluation'
import ReportsApi from '../../api/reports'
import {UseEvaluationContext} from '../../context/evalaution/evaluationContext'
import {IEvalautionProps} from '../../context/evalaution/evaluationContext.props'
import FeedBackApi from '../../api/feedback'
import PaginationContainer from '../../layouts/pagination/pagination'
import {ITableSavedSubmissionsData} from '../../shared/types/table/tableSavedSubmissions/tableSavedSubmissions'
import MakeStyles from '../../assets/makeStyles/makeStyles'
import SelectWithSearch from '../../layouts/select/selectWithSearch'
import ButtonTranparentBorder from '../../layouts/buttons/buttonTransparentBorder'
import ButtonBlue from '../../layouts/buttons/buttonBlue'
// import SelectField2 from '../../layouts/fields/selectField2'

const SavedSubmissions = () => {
  const classesStyles = MakeStyles()
  const {setGetEvaluationList, setEvaluationPointSumReportList, setFeedbacksList} =
    UseEvaluationContext() as IEvalautionProps
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [eventId, setEventId] = useState<number>(-1)
  const [evaluatorId, setEvaluatorId] = useState<number>(-1)
  const [evaluateeId, setEvaluateeId] = useState<number>(-1)
  const [isLoadingApply, setIsLoadingApply] = useState<boolean>(false)
  const [totalCountOfPagination, setTotalCountOfPagination] = useState<number | undefined>()
  const [countPagination, setCountPagination] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  // const [eventsData, setEventsData] = useState<{name: string; id: number}[]>([])
  const [nameOfUsers, setNameOfUsers] = useState<{name: string; id: number}[]>([])
  const [rows, setRows] = useState<ITableSavedSubmissionsData[]>([])
  const [evaluationType, setEvaluationType] = useState<number>(-1)
  // const [evaluationTypeValues] = useState<{name: string; id: number}[]>([
  //   {
  //     id: 1,
  //     name: 'With score',
  //   },
  //   {
  //     id: 2,
  //     name: 'Without score',
  //   },
  // ])

  useEffect(() => {
    ;(async () => {
      const resultUsers = await UsersApi.usersList()
      setNameOfUsers([
        ...resultUsers.data.map((item: {firstName: string; id: number}) => ({
          name: item.firstName,
          id: item.id,
        })),
      ])
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const response = await ReportsApi.evaluationPointSumReportList({
        ...(eventId && {eventId}),
        ...(evaluatorId && {evaluatorId}),
        ...(evaluateeId && {evaluateeId}),
        evaluationType: evaluationType === 2 ? 0 : evaluationType,
        page,
        pageSize,
      })
      setEvaluationPointSumReportList(response.data.reportItems)
      setTotalCountOfPagination(response.data.totalCount)
      if (response.data.reportItems) {
        setRows(response.data.reportItems)
        // const updateEventsData = response.data.reportItems.map(
        //   (item: {eventTitle: string; eventId: number}) => ({
        //     name: item.eventTitle,
        //     id: item.eventId,
        //   }),
        // )
        // setEventsData(
        //   updateEventsData.filter((element: {id: number}) => {
        //     const isDuplicate = updateEventsData.includes(element.id)
        //     if (!isDuplicate) {
        //       updateEventsData.push(element.id)
        //       return true
        //     }
        //     return false
        //   }),
        // )
      }
      setIsLoading(false)
    })()
  }, [pageSize, page])

  useEffect(() => {
    if (totalCountOfPagination) {
      if (pageSize >= totalCountOfPagination) {
        setCountPagination(1)
      } else {
        setCountPagination(Math.ceil(totalCountOfPagination / pageSize))
      }
    }
  }, [pageSize, page, totalCountOfPagination])

  useEffect(() => {
    ;(async () => {
      const response = await EvaluationApi.getEvaluationsList()
      setGetEvaluationList(response.data)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const response = await FeedBackApi.getFeedbacksList()
      setFeedbacksList(response.data)
    })()
  }, [])

  const handleClear = async () => {
    setIsLoading(true)
    setEventId(-1)
    setEvaluatorId(-1)
    setEvaluateeId(-1)
    setEvaluationType(-1)
    const response = await ReportsApi.evaluationPointSumReportList({
      page: 1,
      pageSize: 10,
      evaluationType: -1,
    })
    setRows(response.data.reportItems)
    setTotalCountOfPagination(response.data.totalCount)
    setPage(1)
    setPageSize(10)
    setIsLoading(false)
  }

  const handleApply = async () => {
    setIsLoadingApply(true)
    const response = await ReportsApi.evaluationPointSumReportList({
      ...(eventId && {eventId}),
      ...(evaluatorId && {evaluatorId}),
      ...(evaluateeId && {evaluateeId}),
      page: 1,
      pageSize: 10,
      evaluationType: evaluationType === 2 ? 0 : evaluationType,
    })
    setPage(1)
    setPageSize(10)
    setRows(response.data.reportItems)
    setTotalCountOfPagination(response.data.totalCount)
    setIsLoadingApply(false)
  }

  // const [showCertificate, setShowCertificate] = useState(certificateData.isVisible)
  // const {certificateData} = UseCertificateContext()
  // const [openModalCertificate, setOpenModalCertificate] = useState(false)
  // const openCertificates = () => {
  //   if (!showCertificate) {
  //     setShowCertificate(true)
  //   } else {
  //     setShowCertificate(false)
  //   }
  //   setOpenModalCertificate(false)
  // }
  // const closeModalCertificate = () => setOpenModalCertificate(false)
  // if (!showCertificate) {

  const handleCreateReportTablePDF = async () => {
    await ReportsApi.createReportEvaluationPairs({
      page: 1,
      pageSize: 1,
      adminId: -1,
      evaluationType: evaluationType === 2 ? 0 : evaluationType,
      evaluatorId,
      eventId,
      evaluateeId,
    }).then((response: AxiosResponse) => {
      const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'PairsReportPdf.pdf')
      document.body.appendChild(link)
      link.click()
    })
  }

  const handleCreateReportTableCVS = async () => {
    if (rows) {
      const response = await ReportsApi.evaluationPointSumReportList({
        page: 1,
        pageSize: totalCountOfPagination,
        evaluationType: evaluationType === 2 ? 0 : evaluationType,
        evaluatorId,
        eventId,
        evaluateeId,
      })

      const data: string[][] = [
        ['Event', 'Evaluator Name', 'Evaluatee Name ', 'Hire Date', 'Job Title', 'Salary'],
      ]

      response.data.reportItems.forEach((item: ITableSavedSubmissionsData) => {
        data.push([
          item.eventTitle,
          item.evaluatorName,
          item.evaluateeName,
          item.hireDate ? moment(item.hireDate).format('YYYY-MM-DD HH:mm:ss') : '',
          item.evaluateePosition,
          `${item.monthlySalary.toString()} ${item.currency === 1 ? 'AMD' : 'USD'}`,
        ])
      })
      // `${((Number(item.monthlySalary) * Number(item.bonusPercentage)) / 100).toString()} ${

      const csvContent = `data:text/csv;charset=utf-8,${data.map((e) => e.join(',')).join('\n')}`
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'my_data.csv')
      document.body.appendChild(link)
      link.click()
    }
  }

  return (
    <Box className="saved-submissions-container">
      <Box className="d-flex height-inherit flex-wrap flex-end">
        {/*<Box*/}
        {/*  className={`mr-64 mb-24 width-px-218 ${classesStyles.inputStyle} ${classesStyles.bgWhite}`}*/}
        {/*>*/}
        {/*  <SelectWithSearch*/}
        {/*    data={eventsData}*/}
        {/*    id={eventId}*/}
        {/*    isLoading={isLoading}*/}
        {/*    setId={setEventId}*/}
        {/*    label="Search by event title"*/}
        {/*  />*/}
        {/*</Box>*/}
        <Box
          className={`mr-64 mb-24 width-px-218 ${classesStyles.inputStyle} ${classesStyles.bgWhite}`}
        >
          <SelectWithSearch
            data={nameOfUsers}
            id={evaluatorId}
            isLoading={isLoading}
            setId={setEvaluatorId}
            label="Evaluator"
          />
        </Box>
        <Box
          className={`mr-64 mb-24 width-px-218 ${classesStyles.inputStyle} ${classesStyles.bgWhite}`}
        >
          <SelectWithSearch
            data={nameOfUsers}
            id={evaluateeId}
            isLoading={isLoading}
            setId={setEvaluateeId}
            label="Evaluatee"
          />
        </Box>
        {/*<Box*/}
        {/*  className={`mr-64 mb-24 width-px-218 ${classesStyles.inputStyle} ${classesStyles.bgWhite}`}*/}
        {/*>*/}
        {/* <SelectField2 */}
        {/*  value={evaluationType} */}
        {/*  handleChange={(id) => setEvaluationType(id)} */}
        {/*  fontWeight={500} */}
        {/*  border={false} */}
        {/*  label="Evaluation Type" */}
        {/*  data={evaluationTypeValues} */}
        {/* /> */}
        {/*<SelectWithSearch*/}
        {/*  data={evaluationTypeValues}*/}
        {/*  id={evaluationType}*/}
        {/*  isLoading={isLoading}*/}
        {/*  setId={setEvaluationType}*/}
        {/*  label="Evaluation Type"*/}
        {/*/>*/}
        {/*</Box>*/}
        <Box className="mr-44 mb-24">
          <ButtonTranparentBorder handleClick={handleClear} title="CLEAR" width="width150" />
        </Box>
        <Box className="mb-24">
          {!isLoadingApply ? (
            <ButtonBlue handleClick={handleApply} title="APPLY" width="width150" />
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Box>
      <Box className="mt-26 d-flex">
        <Box>
          <ButtonTranparentBorder handleClick={handleCreateReportTablePDF} title=" EXPORT AS PDF" />
        </Box>
        <Box className="ml-10">
          <ButtonTranparentBorder handleClick={handleCreateReportTableCVS} title="EXPORT AS CSV" />
        </Box>
      </Box>
      <Box className="mt-30">
        {!isLoading && rows && rows.length ? (
          <Box>
            <EnhancedTable table="saved-submissions" rows={rows as unknown as TableArraysType} />
            <PaginationContainer
              limitData={totalCountOfPagination}
              setPage={setPage}
              page={page}
              countPagination={countPagination}
              pageSize={pageSize}
              setPageSize={setPageSize}
            />
          </Box>
        ) : (
          <div className="d-flex justify-center">
            {isLoading ? <CircularProgress /> : 'There is not data'}
          </div>
        )}
      </Box>
      {/* <CertificateModal */}
      {/*  openModal={openModalCertificate} */}
      {/*  closeModal={closeModalCertificate} */}
      {/*  openCertificates={openCertificates} */}
      {/* /> */}
    </Box>
  )
  // }
  // return (
  //   <div className="saved-submissions-certification">
  //     <WrapperCertificates openCertificates={openCertificates} />
  //   </div>
  // )
}

export default SavedSubmissions
