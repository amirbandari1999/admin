import React, {useState} from 'react'
import {Box} from '@mui/material'
import {useNavigate} from 'react-router'
// import CalendarImg from '../../../assets/images/Icons/calendarIconColor'
import EventsPage from '../eventsPage'
import MakeStyles from '../../../assets/makeStyles/makeStyles'
import PlusIcon from '../../../assets/images/Icons/plus'
import TableCalendarIcon from '../../../assets/images/Icons/tableCalendarIcon'
import ButtonBlue from '../../../layouts/buttons/buttonBlue'

const EventsTabs = () => {
  const classes = MakeStyles()
  const [noEventInformation, setNoEventInformation] = useState(false)
  const navigate = useNavigate()

  const handleCreateEvent = () => {
    navigate('event-create', {state: {createNewEvent: true}})
  }

  if (noEventInformation) {
    return (
      <Box component="div" className="no-event-information-container">
        <Box component="div">
          <Box className={classes.mAuto}>
            {/* <CalendarImg /> */}
            <TableCalendarIcon />
          </Box>
          <Box component="div" className="no-event-information ">
            No event information is available yet.
          </Box>
          <Box component="div" className="no-event-information-description mt-6">
            To see event details first you need to create evaluation event.
          </Box>
          <Box className="text-center mt-50">
            <ButtonBlue
              handleClick={handleCreateEvent}
              title="Create new event"
              padding="padding16"
              icon={<PlusIcon />}
            />
          </Box>
        </Box>
      </Box>
    )
  }
  return <EventsPage setNoEventInformation={setNoEventInformation} />
}

export default EventsTabs
