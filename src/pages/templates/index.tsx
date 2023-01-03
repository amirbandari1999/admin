import React, {useEffect, useState} from 'react'
import {Box} from '@mui/material'
// import moment from 'moment'
import CircularProgress from '@mui/material/CircularProgress'
import EnhancedTable from '../../layouts/table/table'
// import Date from '../../layouts/fields/date'
import {IEnhancedTemplatesTableRows} from '../../shared/types/table/table'
import QuestionApi from '../../api/question'
import PaginationContainer from '../../layouts/pagination/pagination'
// import AssignDates from '../../layouts/assignDates/assignDates'

const Index = () => {
  const [searchResult] = useState<IEnhancedTemplatesTableRows[]>()
  // const [startDate, setStartDate] = useState<string>('')
  // const [endDate, setEndDate] = useState<string>('')
  const [rows, setRows] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [countPagination, setCountPagination] = useState<number>(0)
  const [limitData] = useState<number | undefined>(0)

  useEffect(() => {
    if (limitData) {
      if (pageSize >= limitData) {
        setCountPagination(1)
      } else {
        setCountPagination(Math.ceil(limitData / pageSize))
      }
    }
  }, [limitData, pageSize, page])

  // const handleChangeDate = (start: string, end: string) => {
  //   setStartDate(start)
  //   setEndDate(end)
  // }

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)

      const response = await QuestionApi.getTemplates()
      // setLimitData(response.data.totalEventsCount)

      setRows(response.data)
      setIsLoading(false)
    })()
  }, [])

  // useEffect(() => {
  //   if (dateValue) {
  //     const results = rows.filter((item) =>
  //       item.date
  //         .toLowerCase()
  //         .includes(moment(dateValue).format('MM/DD/yyyy').toString().toLowerCase()),
  //     )
  //     setSearchResults(results)
  //   } else {
  //     setSearchResults(undefined)
  //   }
  // }, [dateValue, rows])

  return (
    <Box className="page-container">
      <Box className="page-padding">
        <Box className="page-heading">Templates</Box>
        {/*<Box className="mt-30">*/}
        {/*<AssignDates*/}
        {/*  applyHandle={handleChangeDate}*/}
        {/*  startDateProps={startDate}*/}
        {/*  endDateProps={endDate}*/}
        {/*  disabled={false}*/}
        {/*  border={false}*/}
        {/*  fromToday={false}*/}
        {/*/>*/}
        {/*<Date*/}
        {/*  value={dateValue}*/}
        {/*  onChange={handleChangeDate}*/}
        {/*  border={false}*/}
        {/*  placeholder="Search Template by Event title and/or date"*/}
        {/*/>*/}
        {/*</Box>*/}
        <Box className="mt-40">
          {!isLoading && rows && rows.length ? (
            <Box className="mb-22">
              <EnhancedTable table="templates" rows={searchResult || rows} />
              <PaginationContainer
                limitData={limitData}
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
export default Index
