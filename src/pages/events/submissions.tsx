import React, {useEffect, useState} from 'react'
import {Box, CircularProgress} from '@mui/material'
import Slider from '../../layouts/slider/slider'
import SelectField2 from '../../layouts/fields/selectField2'
import EventsApi from '../../api/events'
import {ISliderStatus} from '../../shared/types/slider/slider'
import PaginationContainer from '../../layouts/pagination/pagination'
import SearchIcon from '../../assets/images/Icons/searchIcon'
import ButtonTranparentBorder from '../../layouts/buttons/buttonTransparentBorder'

const Submissions = () => {
  const [showBorder] = useState(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchByEventId, setSearchByEventId] = useState<number>(-1)
  const [eventsData, setEventsData] = useState<{id: number; name: string}[]>([])
  const [submissionsData, setSubmissionsData] = useState<ISliderStatus[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [countPagination, setCountPagination] = useState(0)
  const [limitData, setLimitData] = useState<number | undefined>()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const response = await EventsApi.getFullEventsPairsByAdmin(searchByEventId, page, pageSize)
      setSubmissionsData(response.data.events)
      setLimitData(response.data.totalEventsCount)
      const updateNewEventsData = response.data.events.map(
        (item: {id: number; eventTitle: string}) => ({
          id: item.id,
          name: item.eventTitle,
        }),
      )
      setEventsData(updateNewEventsData)
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
  }, [limitData, page, pageSize])

  useEffect(() => {
    ;(async () => {
      if (limitData) {
        setIsLoading(true)
        const response = await EventsApi.getFullEventsPairsByAdmin(searchByEventId, page, pageSize)
        setSubmissionsData(response.data.events)
        setLimitData(response.data.totalEventsCount)
        setIsLoading(false)
      }
    })()
  }, [searchByEventId])

  const handleClear = async () => {
    setIsLoading(true)
    setSearchByEventId(-1)
    setPageSize(10)
    setPage(1)
    const response = await EventsApi.getFullEventsPairsByAdmin(-1, 1, 10)
    setSubmissionsData(response.data.events)
    setLimitData(response.data.totalEventsCount)
    setIsLoading(false)
  }

  const renderSlider = () => {
    if (submissionsData && submissionsData.length) {
      return (
        <Box className="mb-30">
          {submissionsData.map((item, index) => (
            <Box className="mt-40" key={index}>
              <Box className="mb-30 break-all submission-card-heading bold font-size-16 mt-10 line-height-20 color-black">
                {item.eventTitle}
              </Box>
              <Slider carouselItems={item} sizeItems="big" isLoading={isLoading} />
            </Box>
          ))}
          <PaginationContainer
            limitData={limitData}
            setPage={setPage}
            page={page}
            countPagination={countPagination}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </Box>
      )
    }
    return <Box className="width-100 text-center mt-60">There is not data</Box>
  }

  return (
    <Box className="submission-container">
      <Box className="submission-container__button-group align-center">
        <Box component="div" className="width-px-272 mr-44">
          <SelectField2
            value={searchByEventId}
            handleChange={(id) => setSearchByEventId(id)}
            fontWeight={400}
            data={eventsData}
            border={showBorder}
            label={
              <Box className="d-flex justify-around align-center">
                <SearchIcon />
                <Box className="ml-12 font-size-15 font-weight-400 color-dark-grey">
                  Search by event title
                </Box>
              </Box>
            }
          />
        </Box>
        <Box className="d-flex align-center">
          <ButtonTranparentBorder handleClick={handleClear} title="CLEAR" width="width150" />
        </Box>
      </Box>
      {!isLoading ? (
        <Box>{renderSlider()}</Box>
      ) : (
        <div className="d-flex justify-center mt-20">
          <CircularProgress />
        </div>
      )}
    </Box>
  )
}

export default Submissions
