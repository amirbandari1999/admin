import {Box, Button} from '@mui/material'
import React from 'react'
import useStylesButton from '../../assets/makeStyles/buttons/buttons'
import {IButtonBlue} from '../../shared/types/buttons/buttons'

const ButtonTransparent = ({
  handleClick,
  title,
  icon,
  width,
  padding,
  color,
  size = 'small',
  fullWidth = false,
}: IButtonBlue) => {
  const classesButton = useStylesButton()

  return (
    <Box
      className={`${padding && classesButton[padding]} ${color && classesButton[color]} ${
        width && classesButton[width]
      }`}
    >
      <Button size={size} fullWidth={fullWidth} onClick={() => handleClick()}>
        {icon && <Box className="mr-16">{icon}</Box>} {title}
      </Button>
    </Box>
  )
}

export default ButtonTransparent
