import React, {useEffect, useState} from 'react'
import {Box, CircularProgress} from '@mui/material'
import moment from 'moment'
import {AxiosResponse} from 'axios'
import WrapperCertificates from '../../layouts/certificates/wrapperCertificates'
import EnhancedTable from '../../layouts/table/table'
import UsersApi from '../../api/users'
import {IEnhancedPerformanceReportTableRows} from '../../shared/types/table/table'
import ReportsApi from '../../api/reports'
import {UseCertificateContext} from '../../context/certificateContext/certificateContext'
import {ICertificateProps} from '../../context/certificateContext/certificateContext.props'
import PaginationContainer from '../../layouts/pagination/pagination'
import SelectWithSearch from '../../layouts/select/selectWithSearch'
import AssignDates from '../../layouts/assignDates/assignDates'
import ButtonBlue from '../../layouts/buttons/buttonBlue'
import ButtonTranparentBorder from '../../layouts/buttons/buttonTransparentBorder'

const PerformanceReport = () => {
  const {
    setShowCertificate,
    showCertificate,
    setEvaluateeName,
    evaluateeName,
    setTotalScore,
    setCreateDate,
    totalScore,
    setMenual,
    menual,
    createDate,
    evaluateeId,
    setNoScore,
    // noScore,
    certificateType,
  } = UseCertificateContext() as ICertificateProps

  const [eventTitleId, setEventTitleId] = useState<number>(-1)
  const [eventTitleData, setEventTitleData] = useState<{name: string; id: number}[]>([])
  const [rowsOfTable, setRowsOfTable] = useState<IEnhancedPerformanceReportTableRows[]>([])
  const [searchEvaluateeId, setSearchEvaluateeId] = useState<number>(-1)
  const [nameOfUsers, setNameOfUsers] = useState<{name: string; id: number}[]>([])
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [countPagination, setCountPagination] = useState<number>(0)
  const [totalCountOfPagination, setTotalCountOfPagination] = useState<number | undefined>()
  const [isLoadingApply, setIsLoadingApply] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [evaluationType, setEvaluationType] = useState<number>(-1)
  const [evaluationTypeValues] = useState<{name: string; id: number}[]>([
    {
      id: 1,
      name: 'With score',
    },
    {
      id: 2,
      name: 'Without score',
    },
  ])

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)

      const response = await ReportsApi.evaluationAbsolutePointReportList({
        page,
        pageSize,
        eventId: eventTitleId,
        evaluateeId: searchEvaluateeId,
        evaluationType: evaluationType === 2 ? 0 : evaluationType,
        ...(startDate && {startDate: moment(startDate).format()}),
        ...(endDate && {endDate: moment(endDate).format()}),
      })
      setTotalCountOfPagination(response.data.totalCount)

      const updateEventsTitleData = [
        ...response.data.reportItems.map((item: {eventTitle: string; eventId: number}) => ({
          name: item.eventTitle,
          id: item.eventId,
        })),
      ]

      setEventTitleData(
        updateEventsTitleData.filter((element: {id: number}) => {
          const isDuplicate = updateEventsTitleData.includes(element.id)
          if (!isDuplicate) {
            updateEventsTitleData.push(element.id)
            return true
          }
          return false
        }),
      )

      setRowsOfTable(response.data.reportItems)
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
      const resultUsers = await UsersApi.usersList()
      setNameOfUsers([
        ...resultUsers.data.map((item: {firstName: string; id: number}) => ({
          name: item.firstName,
          id: item.id,
        })),
      ])
    })()
  }, [])

  const handleChangeDate = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
  }

  const handleShowCertificate = () => {
    setShowCertificate(true)
    setMenual(true)
    setEvaluateeName('')
    setTotalScore('')
    setCreateDate('')
  }

  const handleApply = async () => {
    setIsLoadingApply(true)

    const response = await ReportsApi.evaluationAbsolutePointReportList({
      page: 1,
      pageSize: 10,
      evaluationType: evaluationType === 2 ? 0 : evaluationType,
      ...(eventTitleId && {eventId: eventTitleId}),
      ...(startDate && {startDate: moment(startDate).format()}),
      ...(endDate && {endDate: moment(endDate).format()}),
      ...(searchEvaluateeId && {evaluateeId: searchEvaluateeId}),
    })

    setPage(1)
    setPageSize(10)
    setRowsOfTable(response.data.reportItems)
    setTotalCountOfPagination(response.data.totalCount)
    if (evaluationType === 1) {
      setNoScore(false)
    } else {
      setNoScore(true)
    }
    setIsLoadingApply(false)
  }

  const handleOpenCertificates = () => {
    if (!showCertificate) {
      setShowCertificate(true)
    } else {
      setShowCertificate(false)
      setEvaluateeName('')
      setTotalScore('')
      setCreateDate('')
    }
  }

  const handleCreateCertificate = async () => {
    if (menual) {
      await ReportsApi.createManualCertificate({
        userName: evaluateeName,
        totalScore,
        createDate,
        certificateType,
      }).then((response: AxiosResponse) => {
        const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'Certificate.pdf')
        document.body.appendChild(link)
        link.click()
      })
    } else {
      await ReportsApi.createCertificate({userId: evaluateeId, totalScore, certificateType}).then(
        (response: AxiosResponse) => {
          const url = window.URL.createObjectURL(
            new Blob([response.data], {type: 'application/pdf'}),
          )
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'Certificate.pdf')
          document.body.appendChild(link)
          link.click()
        },
      )
    }
  }

  const handleClear = async () => {
    setIsLoading(true)
    setEventTitleId(-1)
    setSearchEvaluateeId(-1)
    setStartDate('')
    setEndDate('')
    setNoScore(false)
    setEvaluationType(-1)
    setPage(1)
    setPageSize(10)
    const response = await ReportsApi.evaluationAbsolutePointReportList({
      page: 1,
      pageSize: 10,
      evaluationType: -1,
      eventId: -1,
      evaluateeId: -1,
    })
    setRowsOfTable(response.data.reportItems)
    setTotalCountOfPagination(response.data.totalCount)
    setIsLoading(false)
  }

  const handleCreateReportTablePDF = async () => {
    await ReportsApi.createReportEvaluationAbsolute({
      page: 1,
      pageSize: -1,
      adminId: -1,
      evaluatorId: -1,
      evaluationType: evaluationType === 2 ? 0 : evaluationType,
      eventId: eventTitleId,
      evaluateeId: searchEvaluateeId,
    }).then((response: AxiosResponse) => {
      const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'PairsReportPdf.pdf')
      document.body.appendChild(link)
      link.click()
    })
  }

  // const filterRating = (number: number) => {
  //   if (number <= 3) {
  //     return rowsOfTable
  //       .filter((item) => item.sumPoint / item.questionCount <= number)
  //       .length.toString()
  //   }
  //   return rowsOfTable
  //     .filter((item) => item.sumPoint / item.questionCount >= number)
  //     .length.toString()
  // }

  const handleCreateReportTableCVS = async () => {
    const response = await ReportsApi.evaluationAbsolutePointReportList({
      page: 1,
      pageSize: totalCountOfPagination,
      evaluationType: evaluationType === 2 ? 0 : evaluationType,
      ...(eventTitleId && {eventId: eventTitleId}),
      ...(startDate && {startDate: moment(startDate).format()}),
      ...(endDate && {endDate: moment(endDate).format()}),
      ...(searchEvaluateeId && {evaluateeId: searchEvaluateeId}),
    })

    if (response.data.reportItems) {
      const data: string[][] = [
        [
          'Event',
          'Evaluatee name',
          'Hire Date',
          'Job Title',
          'Salary',
          'Rating',
          'Bonus: %',
          'Bonus Amount',
        ],
      ]
      let totalBonuses = 0
      let totalSalariesAMD = 0
      let totalSalariesUSD = 0

      response.data.reportItems.forEach((item: IEnhancedPerformanceReportTableRows) => {
        totalBonuses += (item.monthlySalary * item.bonusPercentage) / 100
        // totalSalariesAMD +=
        //   item.currency === 1 ? (item.monthlySalary * item.bonusPercentage) / 100 : 0
        // totalSalariesUSD +=
        //   item.currency !== 1 ? (item.monthlySalary * item.bonusPercentage) / 100 : 0
        totalSalariesAMD += item.currency === 1 ? item.monthlySalary : 0
        totalSalariesUSD += item.currency !== 1 ? item.monthlySalary : 0

        data.push([
          item.eventTitle,
          item.evaluateeName,
          item.hireDate,
          item.evaluateePosition,
          `${item.monthlySalary} ${item.currency === 1 ? 'AMD' : 'USD'}`,
          item.averagePoint.toString(),
          item.bonusPercentage.toString(),
          `${((item.monthlySalary * item.bonusPercentage) / 100).toString()} ${
            item.currency === 1 ? 'AMD' : 'USD'
          }`,
        ])
      })

      data.push([' '])
      data.push([
        'Total Salaries',
        `${totalSalariesAMD.toString()} AMD`,
        `${totalSalariesUSD.toString()} USD`,
      ])
      data.push(['Total Bonuses', totalBonuses.toString()])
      // data.push([' '])
      // data.push([filterRating(4), 'Exceptional'])
      // data.push([filterRating(3), 'Very Good'])
      // data.push([filterRating(2), 'Good'])
      // data.push([filterRating(1), 'Normal'])

      const csvContent = `data:text/csv;charset=utf-8,${data.map((e) => e.join(',')).join('\n')}`
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'my_data.csv')
      document.body.appendChild(link)
      link.click()
    }
  }

  if (!showCertificate) {
    return (
      <Box className="performance-report">
        <Box className="d-flex flex-wrap mt-2">
          <Box className="width-px-320 mt-18 mr-16">
            <AssignDates
              applyHandle={handleChangeDate}
              startDateProps={startDate}
              endDateProps={endDate}
              disabled={false}
              border={false}
              fromToday={false}
            />
          </Box>
          <Box className="mt-18 mr-16 width-px-218">
            <SelectWithSearch
              data={eventTitleData}
              id={eventTitleId}
              isLoading={isLoading}
              setId={setEventTitleId}
              label="Event Title"
            />
          </Box>
          <Box className="mt-18 mr-16 width-px-218">
            <SelectWithSearch
              data={nameOfUsers}
              id={searchEvaluateeId}
              isLoading={isLoading}
              setId={setSearchEvaluateeId}
              label="Evaluatee"
            />
          </Box>
          <Box className="mt-18 mr-48 width-px-218">
            <SelectWithSearch
              data={evaluationTypeValues}
              id={evaluationType}
              isLoading={isLoading}
              setId={setEvaluationType}
              label="Evaluation Type"
            />
          </Box>
          <Box className="mt-18 mr-16">
            <ButtonTranparentBorder handleClick={handleClear} title="Clear" width="width150" />
          </Box>
          <Box className="mt-18 mr-16 ">
            {!isLoadingApply ? (
              <ButtonBlue handleClick={handleApply} title="Apply" width="width150" />
            ) : (
              <CircularProgress />
            )}
          </Box>
        </Box>
        <Box className="mt-94">
          <Box className="mt-26 d-flex justify-end export-button-wrapper">
            <Box>
              <ButtonTranparentBorder
                handleClick={handleCreateReportTablePDF}
                title="EXPORT AS PDF"
              />
            </Box>
            <Box className="ml-10">
              <ButtonTranparentBorder
                handleClick={handleCreateReportTableCVS}
                title="EXPORT AS CSV"
              />
            </Box>
            <Box className="ml-10">
              <ButtonBlue handleClick={handleShowCertificate} title="GET CERTIFICATE" />
            </Box>
          </Box>
          <Box className="mt-40">
            {!isLoading && rowsOfTable.length ? (
              <Box>
                <EnhancedTable table="performance-report" rows={rowsOfTable} />
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
        </Box>
      </Box>
    )
  }
  return (
    <div className="saved-submissions-certification">
      <WrapperCertificates
        handleCreateCertificate={handleCreateCertificate}
        handleOpenCertificates={handleOpenCertificates}
      />
    </div>
  )
}

export default PerformanceReport
