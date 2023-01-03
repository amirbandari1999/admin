import {Box, Popover} from '@mui/material'
import React from 'react'
import useStylesPopover from '../../assets/makeStyles/popover/popover'
import MessageIcon from '../../assets/images/Icons/message'
import {IPopover} from '../../shared/types/popover/popover'
import CloseIcon from '../../assets/images/Icons/closeIcon'

const PopoverContainer = ({open, onClose, title}: IPopover) => {
  const classesPopover = useStylesPopover()

  return (
    <Popover
      open={open}
      onClose={() => onClose()}
      className={`${classesPopover.popover}`}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Box className="popover-container d-flex align-center">
        <Box className="mr-10">
          <MessageIcon />
        </Box>
        <Box>{title}</Box>
        <Box className="ml-14 cursor-pointer" onClick={() => onClose()}>
          <CloseIcon color="#FFFFFF" />
        </Box>
      </Box>
    </Popover>
  )
}

export default PopoverContainer
