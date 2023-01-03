import React, {Dispatch, useEffect, useState} from 'react'
import {Box, CircularProgress} from '@mui/material'
// import CardWithPercent from '../../layouts/cardWithPercent/cardWithPercent'
import {TableArraysType} from '../../shared/types/table/table'
import EnhancedTable from '../../layouts/table/table'
import EventsApi from '../../api/events'
import PaginationContainer from '../../layouts/pagination/pagination'
import {UseUserContext} from '../../context/userContext/userContext'
import {IUserProps} from '../../context/userContext/userContext.props'

const EventsPage = ({
  setNoEventInformation,
}: {
  setNoEventInformation: Dispatch<React.SetStateAction<boolean>>
}) => {
  // const [cardWithPercent] = useState([])
  const {role} = UseUserContext() as IUserProps
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [countPagination, setCountPagination] = useState(0)
  const [limitData, setLimitData] = useState<number | undefined>(0)
  const [rowsOfTable, setRowsOfTable] = useState<TableArraysType>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      if (Number(role) !== 2) {
        const result = await EventsApi.getFullEventsByAdminList(page, pageSize)
        if (result.data.events.length) {
          setRowsOfTable(result.data.events)
          setLimitData(result.data.totalEventsCount)
          setNoEventInformation(false)
        } else {
          setNoEventInformation(true)
        }
      }
      setIsLoading(false)
    })()
  }, [pageSize, page])

  useEffect(() => {
    if (limitData) {
      if (pageSize >= limitData) {
        setCountPagination(1)
      } else {
        setCountPagination(Math.ceil(limitData / pageSize))
      }
    }
  }, [limitData, pageSize, page])

  return (
    <Box component="div" className="events-container">
      {/* <Box component="div" className="events-container-heading"> */}
      {/* TODO: UNCOMMENT AFTER ENDPOINT */}
      {/* <Box component="div" className="events-title"> */}
      {/*  Ongoing Events */}
      {/*  */}
      {/*  */}
      {/* </Box> */}
      {/* <Button */}
      {/*  variant="contained" */}
      {/*  className={`${classesButtons.colorBlueButton}`} */}
      {/*  color="blue" */}
      {/*  size="large" */}
      {/*  onClick={() => handleCreateEvent()} */}
      {/* > */}
      {/*  Create Event */}
      {/* </Button> */}
      {/* </Box> */}
      {/* <Box component="div" className="progress-container"> */}
      {/*  {cardWithPercent.length ? ( */}
      {/*    cardWithPercent.map((item, index) => <CardWithPercent key={index} percent={item} />) */}
      {/*  ) : ( */}
      {/*    <Box className="mt-10">there is no data</Box> */}
      {/*  )} */}
      {/* </Box> */}
      <Box component="div" className="my-events-container">
        <Box component="div" className="my-events-heading">
          Events List
        </Box>
        <Box>
          {!isLoading && rowsOfTable && rowsOfTable.length ? (
            <Box className="mb-22">
              <EnhancedTable table="events" rows={rowsOfTable} />
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

export default EventsPage
