import React, {useState} from 'react'
import {Box, Button, TextField} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import EditIcon from '../../assets/images/Icons/editIcon'
import useStyles from '../../assets/makeStyles/evaluatorsStep/evaluatorsStep'
import {IWriteYourFeedback} from '../../shared/types/feedback/feedback'
import useStylesButton from '../../assets/makeStyles/buttons/buttons'
import DeleteIcon from '../../assets/images/Icons/deleteIcon'
import ButtonBlue from '../../layouts/buttons/buttonBlue'

const WriteYourFeedback = ({
  feedbackName,
  handleFeedback,
  handleClearProps,
}: IWriteYourFeedback) => {
  const classes = useStyles()
  const classesButtons = useStylesButton()

  const [showBoxFeedback, setShowBoxFeedback] = useState(false)
  const [showCollapseBody, setShowCollapseBody] = useState(false)
  const [writeYourFeedback, setWriteYourFeedback] = useState<
    {value: string | undefined; isEdit: boolean}[]
  >([])
  const [editFeedbackValue, setEditFeedbackValue] = useState<string | undefined>('')

  const [newWriteYourFeedBackElement, setNewWriteYourFeedBackElement] = useState<
    string | undefined
  >('')

  const addNewWriteFeedBackElement = () => {
    setShowCollapseBody(true)
    if (newWriteYourFeedBackElement) {
      setWriteYourFeedback([
        ...writeYourFeedback,
        {value: newWriteYourFeedBackElement, isEdit: false},
      ])
    }
    if (newWriteYourFeedBackElement) {
      handleFeedback(newWriteYourFeedBackElement)
    }
    setNewWriteYourFeedBackElement('')
  }

  const addBoxFeedback = () => {
    if (newWriteYourFeedBackElement) {
      setShowCollapseBody(false)
      setShowBoxFeedback(true)
      setWriteYourFeedback([
        ...writeYourFeedback,
        {value: newWriteYourFeedBackElement, isEdit: false},
      ])
      handleFeedback(newWriteYourFeedBackElement)
      setNewWriteYourFeedBackElement('')
    }
  }

  const handleEdit = () => {
    setShowBoxFeedback(false)
    setShowCollapseBody(true)
  }

  const handleClear = () => {
    setNewWriteYourFeedBackElement('')
    setShowCollapseBody(false)
    setWriteYourFeedback([])
    handleClearProps()
  }

  const handleEditFeedback = (indexProp: number, valueProp: string | undefined) => {
    setWriteYourFeedback([
      ...writeYourFeedback.map((item, index) =>
        index === indexProp ? {...item, isEdit: true} : {...item, isEdit: false},
      ),
    ])
    setEditFeedbackValue(valueProp)
  }

  const handleDeleteFeedback = (index: number) => {
    setWriteYourFeedback([...writeYourFeedback.filter((item, index2) => index !== index2)])
  }

  const handleChecked = (indexProp: number) => {
    setWriteYourFeedback([
      ...writeYourFeedback.map((item, index) =>
        index === indexProp ? {...item, value: editFeedbackValue, isEdit: false} : item,
      ),
    ])
  }

  return (
    <Box>
      <Box className="font-weight-500 font-size-16 line-height-20 d-flex align-center">
        <Box>{feedbackName}</Box>
        {showBoxFeedback && (
          <Box className="ml-24 cursor-pointer">
            <Box onClick={() => handleEdit()}>
              <EditIcon />
            </Box>
          </Box>
        )}
      </Box>
      {showBoxFeedback ? (
        <Box className="evaluators-step-box-container break-word">
          {writeYourFeedback &&
            writeYourFeedback.length &&
            writeYourFeedback.map((item, index) => (
              <Box className="evaluators-step-box-row" key={index}>
                {item.value}
              </Box>
            ))}
        </Box>
      ) : (
        <Box className="collapse-container">
          <Box className="collapse-container-heading mt-26">
            <Box className="font-size-16 font-weight-500 color-black">Write your feedback</Box>
            <Box className="cursor-pointer" onClick={() => addNewWriteFeedBackElement()}>
              <AddIcon />
            </Box>
          </Box>
          {showCollapseBody && (
            <Box>
              <Box className="collapse-container-body">
                {writeYourFeedback.length ? (
                  writeYourFeedback.map((item, index) => (
                    <Box
                      className="collapse-box font-size-14 font-weight-400 line-height-20 d-flex justify-between"
                      key={index}
                    >
                      <Box className="mr-10 width-100">
                        {item.isEdit ? (
                          <TextField
                            fullWidth
                            maxRows={4}
                            multiline
                            inputProps={{maxLength: 500}}
                            value={editFeedbackValue}
                            onChange={(e) => setEditFeedbackValue(e.target.value)}
                          />
                        ) : (
                          <Box>{item.value}</Box>
                        )}
                      </Box>
                      {item.isEdit ? (
                        <Box className="d-flex justify-center align-center">
                          <Button className="width-20">
                            <CheckCircleOutlineIcon onClick={() => handleChecked(index)} />
                          </Button>
                        </Box>
                      ) : (
                        <Box className="d-flex align-center">
                          <Box
                            className="mr-10 cursor-pointer"
                            onClick={() => handleEditFeedback(index, item.value)}
                          >
                            <EditIcon />
                          </Box>
                          <Box
                            className="mr-10 cursor-pointer"
                            onClick={() => handleDeleteFeedback(index)}
                          >
                            <DeleteIcon />
                          </Box>
                        </Box>
                      )}
                    </Box>
                  ))
                ) : (
                  <Box />
                )}
                <TextField
                  value={newWriteYourFeedBackElement}
                  onChange={(event) => setNewWriteYourFeedBackElement(event.target.value)}
                  id="standard-basic"
                  className={`${classes.textFieldWithOutBorder}`}
                  variant="standard"
                  inputProps={{maxLength: 500}}
                />
              </Box>
              <Box className="collapse-container-footer">
                <Box className={`${classesButtons.transparentWithBorderButton}`}>
                  <Button
                    // ${classes.clearButton}
                    onClick={() => handleClear()}
                  >
                    Clear
                  </Button>
                </Box>
                <Box className="ml-10">
                  <ButtonBlue handleClick={() => addBoxFeedback()} title="Add" width="width150" />
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default WriteYourFeedback
