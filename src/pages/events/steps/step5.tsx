import React, {Dispatch, useEffect} from 'react'
import {Box, Button, IconButton, TextField} from '@mui/material'
import uuid from 'react-uuid'
import PercentIcon from '@mui/icons-material/Percent'
import DeleteIcon from '../../../assets/images/Icons/deleteIcon'
import useStylesTextFields from '../../../assets/makeStyles/textFields/textFields'
import {UseCreateEventContext} from '../../../context/createEventContext/createEventContext'
import {ICreateEventProps} from '../../../context/createEventContext/createEventContext.props'
import MakeStyles from '../../../assets/makeStyles/makeStyles'

const Step5 = ({
  view,
  error,
  setNextStep,
}: {
  view: boolean
  error: boolean
  setNextStep: Dispatch<React.SetStateAction<boolean>>
}) => {
  const classesTextFields = useStylesTextFields()
  const classes = MakeStyles()
  const {rangesOfvalue, setRangesOfValue, rangeMin, rangeMax} =
    UseCreateEventContext() as ICreateEventProps

  useEffect(() => {
    const findError = rangesOfvalue.find(
      (item) =>
        !item.bonusPercentage ||
        !item.bonusRangeName ||
        !item.bonusRangeFrom ||
        !item.bonusRangeTo ||
        Number(item.bonusRangeFrom) < Number(rangeMin) ||
        Number(item.bonusRangeFrom) > Number(rangeMax) ||
        Number(item.bonusRangeTo) < Number(rangeMin) ||
        Number(item.bonusRangeTo) > Number(rangeMax),
    )
    if (findError || !rangesOfvalue.length) {
      setNextStep(false)
    } else {
      setNextStep(true)
    }
  }, [rangesOfvalue])

  const handleChangeBonusRangeName = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    id: string,
  ) => {
    if (e.target.value.length < 100) {
      setRangesOfValue(
        rangesOfvalue.map((ranges) => {
          if (ranges.id === id) {
            return {...ranges, bonusRangeName: e.target.value}
          }
          return ranges
        }),
      )
    }
  }

  return (
    <Box>
      <Box className="d-flex align-center justify-between">
        <Box className="font-size-18 font-weight-500 line-height-22" />
      </Box>
      <Box className="create-event-container-step-5 justify-around d-flex mt-14 ">
        <Box className="create-event-body mt-10">
          <Box className="create-event-column">
            <Box className="font-size-16 mr-24 font-weight-700 line-height-22 color-dark-blue">
              Create/Edit ranges
            </Box>
            <Box>
              <Button
                disabled={view}
                onClick={() =>
                  rangesOfvalue.length < 10 &&
                  setRangesOfValue([
                    ...rangesOfvalue,
                    {
                      id: uuid(),
                      bonusRangeFrom: rangeMin,
                      bonusRangeTo: rangeMax,
                      bonusPercentage: '0',
                      bonusRangeName: 'Normal',
                    },
                  ])
                }
              >
                <Box className="text-color-gradient">Add new range</Box>
              </Button>
            </Box>
          </Box>
          <Box className="choose-evaluation-criteria create-event-body pb-30">
            <Box className="d-flex justify-between width-100 align-center">
              <Box className="width-100 range-container">
                {rangesOfvalue.length ? (
                  rangesOfvalue.map((item) => (
                    <Box key={item.id} className="d-flex mt-40 justify-around align-center">
                      <Box className="mr-10">
                        <Button
                          className="cursor-pointer"
                          onClick={() =>
                            !view &&
                            setRangesOfValue(rangesOfvalue.filter((item2) => item2.id !== item.id))
                          }
                        >
                          <DeleteIcon />
                        </Button>
                      </Box>
                      <Box className="d-flex flex-column width-100">
                        <Box>
                          <Box className="width-100 mb-10 d-flex ">
                            <Box className="cursor-pointer color-dark-grey font-size-12 font-weight-400">
                              Range of name
                            </Box>
                          </Box>
                          <Box className="mr-10">
                            <TextField
                              maxRows={4}
                              multiline
                              onChange={(e) => handleChangeBonusRangeName(e, item.id)}
                              disabled={view}
                              size="small"
                              className={`${classes.inputStyle} ${classes.bgGray} input-base`}
                              error={!item.bonusRangeName}
                              value={item.bonusRangeName}
                            />
                          </Box>
                        </Box>
                        <Box className="mt-10 settings-container-step-5">
                          <Box className="mr-30">
                            <Box className="width-100 mb-10 d-flex">
                              <Box className="cursor-pointer color-dark-grey font-size-12 font-weight-400">
                                Range min to max
                              </Box>
                            </Box>
                            <Box className="d-flex align-center mb-10">
                              <TextField
                                disabled={view}
                                className={`${classesTextFields.numberRemoveArrowUpDown} ${classes.bgGray} ${classes.inputStyle} `}
                                value={item.bonusRangeFrom}
                                type="number"
                                error={
                                  item.bonusRangeFrom
                                    ? Number(item.bonusRangeFrom) < Number(rangeMin) ||
                                      Number(item.bonusRangeFrom) > Number(rangeMax)
                                    : true
                                }
                                onChange={(e) => {
                                  if (
                                    Number(e.target.value) <= 100 &&
                                    Number(e.target.value) > -1
                                  ) {
                                    setRangesOfValue(
                                      rangesOfvalue.map((item2) => {
                                        if (item2.id === item.id) {
                                          return {...item2, bonusRangeFrom: e.target.value}
                                        }
                                        return item2
                                      }),
                                    )
                                  }
                                }}
                                size="small"
                              />
                              <Box className="ml-10 mr-10">To</Box>
                              <TextField
                                disabled={view}
                                className={`${classesTextFields.numberRemoveArrowUpDown} ${classes.bgGray} ${classes.inputStyle}`}
                                error={
                                  item.bonusRangeTo
                                    ? Number(item.bonusRangeTo) < Number(rangeMin) ||
                                      Number(item.bonusRangeTo) > Number(rangeMax)
                                    : true
                                }
                                value={item.bonusRangeTo}
                                type="number"
                                onChange={(e) =>
                                  setRangesOfValue(
                                    rangesOfvalue.map((item2) => {
                                      if (item2.id === item.id) {
                                        return {...item2, bonusRangeTo: e.target.value}
                                      }
                                      return item2
                                    }),
                                  )
                                }
                                size="small"
                              />
                            </Box>
                          </Box>
                          <Box>
                            <Box className="mb-10 color-dark-grey font-size-12 font-weight-400 ">
                              Bonus Amount
                            </Box>
                            <Box className="d-flex align-center">
                              <Box className="input-field-percent">
                                <TextField
                                  className="text-field width-100"
                                  required
                                  disabled={view}
                                  id="outlined-required"
                                  size="small"
                                  onChange={(e) => {
                                    if (
                                      Number(e.target.value) <= 100 &&
                                      Number(e.target.value) > -1
                                    ) {
                                      setRangesOfValue(
                                        rangesOfvalue.map((item2) => {
                                          if (item2.id === item.id) {
                                            return {...item2, bonusPercentage: e.target.value}
                                          }
                                          return item2
                                        }),
                                      )
                                    }
                                  }}
                                  error={!item.bonusPercentage}
                                  value={item.bonusPercentage}
                                />
                                <IconButton className="icon-button" aria-label="directions">
                                  <PercentIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box className="mt-40 ml-24">There is not data</Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="color-red mt-30 text-center">
        {error && 'Please fill out required fields'}
      </Box>
    </Box>
  )
}

export default Step5
