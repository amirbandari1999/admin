import React, {Dispatch, useEffect, useState} from 'react'
import {Box, Button, FormControlLabel, Radio, RadioGroup, TextField} from '@mui/material'
import uuid from 'react-uuid'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import DeleteIcon from '../../../assets/images/Icons/deleteIcon'
import EditIcon from '../../../assets/images/Icons/editIcon_2'
import useStylesButton from '../../../assets/makeStyles/buttons/buttons'
import {UseCreateEventContext} from '../../../context/createEventContext/createEventContext'
import {ICreateEventProps} from '../../../context/createEventContext/createEventContext.props'
import MakeStyles from '../../../assets/makeStyles/makeStyles'
import useStylesTextFields from '../../../assets/makeStyles/textFields/textFields'

const Step4 = ({
  view,
  error,
  setNextStep,
}: {
  view: boolean
  error: boolean
  setNextStep: Dispatch<React.SetStateAction<boolean>>
}) => {
  const classesTextFields = useStylesTextFields()
  const classesButtons = useStylesButton()
  const classes = MakeStyles()
  const [rateFromError, setRateFromError] = useState<boolean>(false)
  const [rateToError, setRateToError] = useState<boolean>(false)
  const {
    buttonsOfValue,
    setButtonsOfValue,
    withScores,
    setRatePointTo,
    questions,
    setRatePointFrom,
    ratePointTo,
    ratePointFrom,
  } = UseCreateEventContext() as ICreateEventProps

  useEffect(() => {
    if (!rateFromError && !rateToError) {
      setNextStep(true)
    } else {
      setNextStep(false)
    }
  }, [questions, rateFromError, rateToError])

  useEffect(() => {
    if (
      Number(ratePointFrom) < 0 ||
      Number(ratePointFrom) >= Number(ratePointTo) ||
      !ratePointFrom
    ) {
      setRateFromError(true)
    } else {
      setRateFromError(false)
    }
  }, [ratePointFrom, ratePointTo])

  useEffect(() => {
    if (Number(ratePointFrom) >= Number(ratePointTo) || Number(ratePointTo) <= 2 || !ratePointTo) {
      setRateToError(true)
    } else {
      setRateToError(false)
    }
  }, [ratePointTo, ratePointFrom])

  useEffect(() => {
    if (buttonsOfValue.length) {
      setNextStep(true)
    } else {
      setNextStep(false)
    }
  }, [buttonsOfValue])

  return (
    <Box>
      <Box className="d-flex align-center justify-between">
        <Box className="font-size-18 font-weight-500 line-height-22" />
      </Box>
      <Box className="create-event-container-step-5 justify-around d-flex mt-14 ">
        {!withScores ? (
          <Box className="create-event-body mt-10">
            <Box className="create-event-column">
              <Box className="font-size-16 mr-24 font-weight-700 line-height-22 color-dark-blue">
                Create/Edit buttons
              </Box>
              <Box>
                <Button
                  disabled={view}
                  onClick={() =>
                    buttonsOfValue.length < 10 &&
                    setButtonsOfValue([
                      ...buttonsOfValue,
                      {
                        id: uuid(),
                        scoringName: `New Button ${buttonsOfValue.length}`,
                        edit: false,
                        scoringValue: '1',
                      },
                    ])
                  }
                >
                  <p className="text-color-gradient">Add new button</p>
                </Button>
              </Box>
            </Box>
            <Box className="choose-evaluation-criteria create-event-body pb-30">
              <Box className="d-flex justify-between mr-30 width-100 align-center">
                <Box className="width-100">
                  {buttonsOfValue.length ? (
                    buttonsOfValue.map((item) => (
                      <Box key={item.id} className="settings-container mt-40">
                        <Box className="mr-30 setting-item">
                          <Box className="width-100 mb-10 d-flex ">
                            <Box
                              className="cursor-pointer"
                              onClick={() =>
                                !view &&
                                setButtonsOfValue(
                                  buttonsOfValue.filter((item2) => item2.id !== item.id),
                                )
                              }
                            >
                              <DeleteIcon />
                            </Box>
                            <Box
                              className="ml-10 cursor-pointer"
                              onClick={() =>
                                !view &&
                                setButtonsOfValue(
                                  buttonsOfValue.map((item2) => {
                                    if (item2.id === item.id) {
                                      return {...item2, edit: !item2.edit}
                                    }
                                    return item2
                                  }),
                                )
                              }
                            >
                              {!item.edit ? <EditIcon /> : <CheckCircleOutlineIcon />}
                            </Box>
                          </Box>
                          {!item.edit ? (
                            <Box className={`${classesButtons.transparentWithBorderButton}`}>
                              <Button
                                disabled={view}
                                onClick={() =>
                                  setButtonsOfValue(
                                    buttonsOfValue.map((item2) => {
                                      if (item2.id === item.id) {
                                        return {...item2, edit: !item2.edit}
                                      }
                                      return item2
                                    }),
                                  )
                                }
                                className={` ${classesButtons.width190}`}
                              >
                                {item.scoringName}
                              </Button>
                            </Box>
                          ) : (
                            <TextField
                              disabled={view}
                              maxRows={4}
                              multiline
                              className={`${classes.inputStyle} ${classes.bgGray}`}
                              value={item.scoringName}
                              onChange={(e) =>
                                e.target.value.length < 100 &&
                                setButtonsOfValue(
                                  buttonsOfValue.map((item2) => {
                                    if (item2.id === item.id) {
                                      return {...item2, scoringName: e.target.value}
                                    }
                                    return item2
                                  }),
                                )
                              }
                              size="small"
                            />
                          )}
                        </Box>
                        <Box>
                          <Box className="width-100 mb-10 d-flex">
                            <Box className="cursor-pointer">Point</Box>
                          </Box>
                          <TextField
                            disabled={view}
                            className={`${classes.inputStyle} ${classes.bgGray}`}
                            value={item.scoringValue}
                            type="number"
                            onChange={(e) => {
                              if (Number(e.target.value) <= 20) {
                                setButtonsOfValue(
                                  buttonsOfValue.map((item2) => {
                                    if (item2.id === item.id) {
                                      return {...item2, scoringValue: e.target.value}
                                    }
                                    return item2
                                  }),
                                )
                              }
                            }}
                            size="small"
                          />
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
        ) : (
          <Box className="create-event-body mt-10">
            <Box className="d-flex justify-between width-100">
              <Box className="rating-score-range-container">
                <Box className="create-event-select mt-10">
                  <Box className="create-event-select-column">
                    <Box className="font-size-16 font-weight-500 line-height-22 color-black color-dark-blue">
                      Rating Score Range
                    </Box>
                    <Box className=" font-size-14 line-height-22 mt-6 color-light-gray-2">
                      The rating is from the lowest score to the highest
                    </Box>
                  </Box>
                  <Box className="create-event-select-radio mt-10">
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="female"
                      name="radio-buttons-group"
                    >
                      <FormControlLabel
                        control={
                          <Radio checked color="default" className={`${classes.checkboxColor}`} />
                        }
                        label={
                          <Box className="d-flex justify-center align-item">
                            From
                            <TextField
                              disabled={view}
                              error={rateFromError}
                              InputProps={{inputProps: {min: 0}}}
                              variant="standard"
                              type="number"
                              placeholder="1"
                              value={ratePointFrom}
                              size="small"
                              className={`${classesTextFields.numberRemoveArrowUpDown} ${classesTextFields.textFieldSmall40}`}
                              onChange={(e) => setRatePointFrom(e.target.value)}
                            />
                            point - to{' '}
                            <TextField
                              disabled={view}
                              error={rateToError}
                              InputProps={{inputProps: {min: 0}}}
                              variant="standard"
                              type="number"
                              placeholder="10"
                              value={ratePointTo}
                              size="small"
                              className={`${classesTextFields.numberRemoveArrowUpDown} ${classesTextFields.textFieldSmall40}`}
                              onChange={(e) => setRatePointTo(e.target.value)}
                            />{' '}
                            points
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <Box className="color-red mt-30 text-center">
        {error && 'Please fill out required fields'}
      </Box>
    </Box>
  )
}

export default Step4
