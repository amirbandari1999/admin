import {Box, Button} from '@mui/material'
import React from 'react'
import useStylesButton from '../../assets/makeStyles/buttons/buttons'
import {IButtonBlue} from '../../shared/types/buttons/buttons'

const ButtonBlue = ({
  handleClick,
  title,
  icon,
  width,
  padding,
  disabled = false,
  size = 'small',
  fullWidth = false,
}: IButtonBlue) => {
  const classesButton = useStylesButton()

  return (
    <Box
      className={`${classesButton.colorBlueButton} ${padding && classesButton[padding]} ${
        width && classesButton[width]
      }`}
    >
      <Button
        disabled={disabled}
        size={size}
        fullWidth={fullWidth}
        variant="contained"
        color="blue"
        onClick={() => handleClick()}
      >
        {icon && <Box className="mr-16">{icon}</Box>} {title}
      </Button>
    </Box>
  )
}

export default ButtonBlue
