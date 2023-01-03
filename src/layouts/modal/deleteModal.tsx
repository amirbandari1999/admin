import {Box, Button, CircularProgress, Modal} from '@mui/material'
import React from 'react'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import useStylesModal from '../../assets/makeStyles/modals/modals'
import {IModalDelete} from '../../shared/types/modal/modal.props'
import useStylesButton from '../../assets/makeStyles/buttons/buttons'

const DeleteModal = ({openModal, closeModal, handleDelete, isLoading, error}: IModalDelete) => {
  const classes = useStylesModal()
  const classesButton = useStylesButton()

  return (
    <Modal
      className={`${classes.styledModal}`}
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={openModal}
      onClose={closeModal}
      BackdropProps={{
        timeout: 200,
      }}
    >
      <Box className={classes.modalContainer}>
        <Box className="modal-success-container mt-26 text-center">
          <Box className="m-auto font-size-50">
            <WarningAmberIcon className="color-red" fontSize="inherit" />
          </Box>
          <Box className="mt-14 font-size-16 color-dark-blue font-weight-500 line-height-22">
            Are you sure want to delete
          </Box>
        </Box>
        <Box className="d-flex align-center justify-center">
          <Box className={`${classesButton.transparentWithBorderButton}`}>
            <Button className={`${classesButton.width128}`} onClick={closeModal}>
              Cancel
            </Button>
          </Box>
          <Box className="ml-10">
            {isLoading ? (
              <Box className="w-100 text-center">
                <CircularProgress />
              </Box>
            ) : (
              <Box className={`${classesButton.colorBlueButton}`}>
                <Button className={`${classesButton.width128}`} onClick={handleDelete}>
                  Delete
                </Button>
              </Box>
            )}
          </Box>
        </Box>
        {error && (
          <Box className="m-auto mt-24 color-red text-center pb-20">Something went wrong</Box>
        )}
      </Box>
    </Modal>
  )
}

export default DeleteModal
