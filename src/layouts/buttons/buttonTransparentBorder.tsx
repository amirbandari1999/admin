import {Box, Button} from '@mui/material'
import React from 'react'
import useStylesButton from '../../assets/makeStyles/buttons/buttons'
import {IButtonBlue} from '../../shared/types/buttons/buttons'

const ButtonTranparentBorder = ({
  handleClick,
  title,
  icon,
  width,
  padding,
  fullWidth = false,
}: IButtonBlue) => {
  const classesButton = useStylesButton()

  return (
    <Box
      className={`${classesButton.transparentWithBorderButton} ${
        padding && classesButton[padding]
      } ${width && classesButton[width]}`}
    >
      <Button fullWidth={fullWidth} onClick={() => handleClick()}>
        {icon && <Box className="mr-16">{icon}</Box>} {title}
      </Button>
    </Box>
  )
}

export default ButtonTranparentBorder
