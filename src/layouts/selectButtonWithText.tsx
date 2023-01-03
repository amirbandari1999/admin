import React, {useState} from 'react'
import {Box, Button} from '@mui/material'
import useStylesButton from '../assets/makeStyles/buttons/buttons'
import {ISelectButtonWithText} from '../shared/types/events/events'

const SelectButtonWithText = ({scorings, onChange, disabled}: ISelectButtonWithText) => {
  const classes = useStylesButton()
  const [buttonActive, setButtonActive] = useState(0)

  return (
    <Box className="d-flex flex-wrap">
      {scorings.map((elem, index) => (
        <Box
          key={index + 1}
          className={`mr-10 mb-10 ${
            buttonActive === index + 1
              ? classes.buttonEvaluation
              : classes.transparentWithBorderButton
          }`}
        >
          <Button
            onClick={() => {
              if (onChange) {
                onChange(elem.scoringValue)
                setButtonActive(index + 1)
              }
            }}
            disabled={disabled}
          >
            {elem.scoringName}
          </Button>
        </Box>
      ))}
    </Box>
  )
}

export default SelectButtonWithText
