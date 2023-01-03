import Tooltip from '@mui/material/Tooltip'
import {Box, TextField} from '@mui/material'
import Menu from '@mui/material/Menu'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import Stack from '@mui/material/Stack'
import DateRangePicker, {DateRange} from '@mui/lab/DateRangePicker'
import Grid from '@mui/material/Grid'
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker'
import MonthPicker from '@mui/lab/MonthPicker'
import React, {useEffect, useState} from 'react'
import {styled} from '@mui/material/styles'
import MuiDateRangePickerDay from '@mui/lab/DateRangePickerDay'
import moment from 'moment'
import CalendarIcon from '../../assets/images/Icons/calendarIcon'
import {ISelectDate} from '../../shared/types/select'
import MakeStyles from '../../assets/makeStyles/makeStyles'
import ButtonTransparent from '../buttons/buttonTransparent'

const DateRangePickerDay = styled(MuiDateRangePickerDay)(
  ({theme, isHighlighting, isStartOfHighlighting, isEndOfHighlighting}) => ({
    ...(isHighlighting && {
      borderRadius: 0,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.dark,
      },
    }),
    ...(isStartOfHighlighting && {
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    }),
    ...(isEndOfHighlighting && {
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    }),
  }),
) as any

const minDate = new Date('2020-01-01T00:00:00.000')
const maxDate = new Date('2034-01-01T00:00:00.000')

const AssignDates = ({
  error,
  border,
  label,
  disabled,
  applyHandle,
  startDateProps,
  endDateProps,
  backgroundColor,
  fromToday,
}: ISelectDate) => {
  const classField = MakeStyles()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showDate, setShowDate] = useState(false)
  const openToolTip = Boolean(anchorEl)
  const [dateNote, setDateNote] = useState<Date | null>(new Date())
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [days, setDays] = useState(0)
  const [selectedRangeDate, setSelectedRangeDate] = useState<DateRange<Date | string>>([null, null])

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget)
    }
  }

  const handleApply = () => {
    applyHandle(startDate, endDate)
    setShowDate(true)
    setAnchorEl(null)
  }

  const handleClearDates = () => {
    setSelectedRangeDate([null, null])
    setShowDate(false)
    setAnchorEl(null)
  }

  const renderWeekPickerDay = (date: Date, dateRangePickerDayProps: any) => (
    <DateRangePickerDay {...dateRangePickerDayProps} />
  )

  useEffect(() => {
    if (!startDateProps) {
      setShowDate(false)
      setEndDate('')
      setStartDate('')
    }
  }, [startDateProps, endDateProps])

  useEffect(() => {
    if (startDate && endDate) {
      const start = moment(startDate)
      const end = moment(endDate)
      const day = end.diff(start, 'days')
      setDays(day)
    } else {
      setDays(0)
    }
  }, [startDate, endDate, selectedRangeDate])

  useEffect(() => {
    if (startDateProps) {
      setStartDate(moment(startDateProps).format('L'))
      setShowDate(true)
    }
    if (endDateProps) {
      setEndDate(moment(endDateProps).format('L'))
    }

    setSelectedRangeDate([startDateProps as string, endDateProps as string])
  }, [startDateProps, endDateProps])

  return (
    <Box className={`${border && 'border-gray border-radius-30'}`}>
      <Tooltip title="" disableHoverListener>
        <Box
          className={`${disabled && 'cursor-auto'} ${
            error && 'border-red'
          } select-date ${backgroundColor}`}
          onClick={handleClick}
        >
          {showDate ? (
            <Box className={`${disabled && 'color-light-gray-2'}`}>
              {startDate} - {endDate}
            </Box>
          ) : (
            <Box className={`${disabled && 'color-light-gray-2'}`}>
              {label || 'Select Start / End Date'}
            </Box>
          )}
          <Box>
            <CalendarIcon />
          </Box>
        </Box>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={openToolTip}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: '500px',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            background: '#FFFFFF',
            padding: '6px 14px 0px 14px',
            border: '1px solid #E6E6E6',
            borderRadius: '30px',
          },
        }}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box className="d-flex justify-between align-center">
            <Stack>
              <DateRangePicker
                readOnly
                startText=""
                endText=""
                value={selectedRangeDate}
                onChange={(newValue: React.SetStateAction<DateRange<string | Date>>) => {
                  setSelectedRangeDate(newValue)
                }}
                renderInput={(startProps, endProps) => {
                  if (startProps?.inputProps?.value === endProps?.inputProps?.value) {
                    setEndDate(endProps?.inputProps?.value)
                  } else {
                    setStartDate(startProps?.inputProps?.value)
                    setEndDate(endProps?.inputProps?.value)
                  }

                  return (
                    <Box className="d-flex border-gray border-radius-30">
                      <TextField className={classField.textFieldBorderNone} {...startProps} />
                      <TextField
                        error={startProps?.inputProps?.value === endProps?.inputProps?.value}
                        className={classField.calendarTextField}
                        {...endProps}
                      />
                    </Box>
                  )
                }}
              />
            </Stack>
            <div className="year">{moment(dateNote).format('YYYY')}</div>
          </Box>
          <Box className="date-container">
            <Grid container spacing={2}>
              <Grid item>
                <MonthPicker
                  className="month-picker"
                  disablePast={fromToday}
                  date={dateNote}
                  minDate={minDate}
                  maxDate={maxDate}
                  onChange={(newDate) => {
                    setDateNote(newDate)
                    setSelectedRangeDate([newDate, moment(newDate).add(1, 'months').format('llll')])
                  }}
                />
              </Grid>
              <Grid item md={8}>
                <StaticDateRangePicker
                  className="calendar"
                  displayStaticWrapperAs="desktop"
                  disablePast={fromToday}
                  value={selectedRangeDate}
                  onChange={(newDate) => {
                    setDateNote(newDate[0])
                    setSelectedRangeDate(newDate)
                  }}
                  renderDay={renderWeekPickerDay}
                  onMonthChange={(e) => {
                    setDateNote(e)
                  }}
                  renderInput={(startProps, endProps) => (
                    <Box>
                      <TextField {...startProps} />
                      <TextField {...endProps} />
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
            <Box className="d-flex align-center justify-between date-apply-container footer-calendar">
              <Box className="ml-30">{`${days} days`}</Box>
              <Box className="d-flex">
                <Box>
                  <ButtonTransparent
                    handleClick={handleClearDates}
                    color="colorGray"
                    title="Clear"
                    size="large"
                    width="width150"
                  />
                </Box>
                <Box>
                  <ButtonTransparent
                    color="colorLightBlue"
                    size="large"
                    handleClick={handleApply}
                    title="Apply"
                    width="width150"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </LocalizationProvider>
      </Menu>
    </Box>
  )
}

export default AssignDates
