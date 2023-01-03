import React, {useEffect, useState} from 'react'
import {Box, Button} from '@mui/material'
import clsx from 'clsx'
import useStylesButton from '../assets/makeStyles/buttons/buttons'
import {ISelectButton} from '../shared/types/events/events'

const SelectButton = ({onChange, disabled, ratePointFrom, ratePointTo, point}: ISelectButton) => {
  const classes = useStylesButton()
  const [buttonActive, setButtonActive] = useState(0)

  useEffect(() => {
    if (point) {
      setButtonActive(point)
    }
  }, [point])

  return (
    <Box className="d-flex align-center">
      {[...Array(ratePointTo)].map((elem, index) => (
        <Box
          key={index + ratePointFrom}
          className={` ${
            buttonActive === index + ratePointFrom
              ? clsx(classes.activeButton, classes.bR100)
              : clsx(classes.selectButton, classes.bR100)
          }`}
        >
          <Button
            onClick={() => {
              if (!disabled && onChange) {
                onChange(index + ratePointFrom)
                setButtonActive(index + ratePointFrom)
              }
            }}
            // disabled={!!page}
          >
            {index + ratePointFrom}
          </Button>
        </Box>
      ))}
    </Box>
  )
}

export default SelectButton
