import {Box, Button, Checkbox, FormControlLabel, Modal, TextField} from '@mui/material'
import React, {Dispatch, useEffect, useState} from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import useStylesModal from '../../assets/makeStyles/modals/modals'
import {IQuestionGroupTitle} from '../../shared/types/events/events'
import EditIcon from '../../assets/images/Icons/editIcon_2'
import DeleteIcon from '../../assets/images/Icons/deleteIcon'
import MakeStyles from '../../assets/makeStyles/makeStyles'
import QuestionApi from '../../api/question'
import {UseCreateEventContext} from '../../context/createEventContext/createEventContext'
import {ICreateEventProps} from '../../context/createEventContext/createEventContext.props'
import criteriaUtils from '../../pages/utils/criteriaUtils'
import ButtonTransparent from '../buttons/buttonTransparent'

const AddNewGroupQuestionModal = ({
  openModal,
  closeModal,
  handleSaveDetailsProps,
  loading,
  setLoading,
  error,
  dataProps,
}: {
  openModal: boolean
  closeModal: () => void
  handleSaveDetailsProps: (value: IQuestionGroupTitle[]) => void
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  error: boolean
  dataProps: IQuestionGroupTitle[]
}) => {
  // const {setQuestionGroupTitleIsDefault} = UseCreateEventContext() as ICreateEventProps

  const classes = useStylesModal()
  const classesStyles = MakeStyles()
  const {setQuestionGroupTitle, setQuestionGroupTitleIsDefault} =
    UseCreateEventContext() as ICreateEventProps
  const [disabledSaveButton, setDisabledSaveButton] = useState(true)
  const [checkedSubquestions, setCheckedSubquestions] = useState<IQuestionGroupTitle[]>([])
  const [typeNameValue, setTypeNameValue] = useState<string>('')
  const [data, setData] = useState<IQuestionGroupTitle[]>([])
  const [loadingData, setLoadingData] = useState<boolean>(false)

  useEffect(() => {
    const updateData = dataProps.map((item) => ({...item, isEdit: false}))
    setData(updateData)
  }, [dataProps])

  const handleBack = () => {
    closeModal()
  }

  useEffect(() => {
    if (checkedSubquestions.length) {
      setDisabledSaveButton(false)
    } else {
      setDisabledSaveButton(true)
    }
  }, [checkedSubquestions])

  const handleAdd = async () => {
    setLoading(true)
    handleSaveDetailsProps(checkedSubquestions)
    closeModal()
    setCheckedSubquestions([])
    const dataGroupQuestions = checkedSubquestions.map((item) => ({
      id: item.id,
      questionGroupTitle: item.questionGroupTitle,
      applyDefault: item.applyDefault,
    }))

    await Promise.all(
      dataGroupQuestions.map(async (item: IQuestionGroupTitle) => criteriaUtils(item)),
    )
    await getQuestionGroupList()
    setLoading(false)
  }

  const handleChecked = (checked: boolean, item: IQuestionGroupTitle) => {
    if (checked) {
      setCheckedSubquestions([...checkedSubquestions, {...item, applyDefault: true}])
    } else {
      setCheckedSubquestions(
        checkedSubquestions.filter((itemFilter: {id: number}) => {
          if (itemFilter.id !== item.id) {
            return item
          }
          setCheckedSubquestions([...checkedSubquestions, {...item, applyDefault: false}])
          return null
        }),
      )
    }
  }

  const handleEdit = (id: number) => {
    const updateData = data.map((item) => {
      if (item.id === id) {
        return {...item, isEdit: !item.isEdit}
      }
      return item
    })
    setData(updateData)
  }

  const handleChangeQuestionGroupTitle = (value: string, id: number) => {
    setLoadingData(true)

    const updateData = data.map((item) => {
      if (item.id === id) {
        return {...item, questionGroupTitle: value}
      }
      return item
    })
    setData(updateData)
    setLoadingData(false)
  }

  const getQuestionGroupList = async () => {
    const response = await QuestionApi.getQuestionsGroups()
    setQuestionGroupTitle(
      response.data.map((item: {applyDefault: boolean}) => item.applyDefault && item),
    )
    setQuestionGroupTitleIsDefault(
      response.data
        .filter((item: {applyDefault: boolean}) => !item.applyDefault)
        .map((item: {applyDefault: boolean}) => item),
    )
  }

  const handleDelete = async (id: number) => {
    setLoadingData(true)
    await QuestionApi.deleteQuestionGroup(id)
    await getQuestionGroupList()
    setLoadingData(false)
  }

  const handleCreateQuestionGroup = async () => {
    if (typeNameValue && !loadingData) {
      setLoadingData(true)
      await QuestionApi.createQuestionGroup(typeNameValue)
      await getQuestionGroupList()
      setTypeNameValue('')
      setLoadingData(false)
    }
  }

  return (
    <Modal
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={openModal}
      onClose={closeModal}
      BackdropProps={{
        timeout: 200,
      }}
      className={`${classes.styledModal}`}
    >
      <Box className={classes.modalContainer}>
        <Box
          id="unstyled-modal-title"
          className="modal-heading text-center font-weight-700 font-size-16 line-height-22 color-dark-blue"
        >
          New Criteria
        </Box>
        <Box className="modal-body">
          <Box className="font-size-16 font-weight-400 line-height-22 color-dark-blue text-center">
            Evaluation Criteria Name
          </Box>
          <Box className="d-flex justify-center mt-20 pr-10 pl-10">
            <TextField
              placeholder="Type Name"
              size="small"
              value={typeNameValue}
              onChange={(e) => setTypeNameValue(e.target.value)}
              className={`${classesStyles.inputStyle} ${classesStyles.w100} ${classesStyles.bgGray}`}
            />
            <Button onClick={() => handleCreateQuestionGroup()}>
              <CheckCircleOutlineIcon />
            </Button>
          </Box>
          {loadingData ? (
            <Box className="m-auto mt-36 text-center pb-10">
              <CircularProgress />
            </Box>
          ) : (
            <Box className="mt-32 modal-body-group-question">
              {data && data.length ? (
                data.map((item) => (
                  <Box key={item.id} className="ml-10 mb-22 mr-10 ">
                    {!item.isEdit ? (
                      <Box className="modal-column">
                        <FormControlLabel
                          control={
                            <Checkbox
                              className={`${classes.checkboxColor}`}
                              onChange={(e) => handleChecked(e.target.checked, item)}
                            />
                          }
                          key={item.id}
                          label={
                            <Box className="color-dark-blue font-weight-400 font-size-15 ">
                              {item.questionGroupTitle}
                            </Box>
                          }
                        />
                        <Box className="d-flex align-center justify-end">
                          <Button onClick={() => handleEdit(item.id)}>
                            <EditIcon />
                          </Button>
                          <Button onClick={() => handleDelete(item.id)}>
                            <DeleteIcon />
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box className="d-flex align-center">
                        <TextField
                          value={item.questionGroupTitle}
                          maxRows={30}
                          onChange={(e) => handleChangeQuestionGroupTitle(e.target.value, item.id)}
                        />
                        <Button onClick={() => handleEdit(item.id)}>
                          <CheckCircleOutlineIcon />
                        </Button>
                      </Box>
                    )}
                  </Box>
                ))
              ) : (
                <Box className="color-dark-blue">There is no Data</Box>
              )}
            </Box>
          )}
        </Box>
        <Box className="modal-footer">
          {loading ? (
            <Box className="m-auto text-center pb-10">
              <CircularProgress />
            </Box>
          ) : (
            <Box className="d-flex">
              <Box className="mr-10">
                <ButtonTransparent handleClick={handleBack} color="colorGray" title="Cancel" />
              </Box>
              <ButtonTransparent
                color="colorLightBlue"
                disabled={disabledSaveButton}
                handleClick={handleAdd}
                title="Add"
              />
            </Box>
          )}
        </Box>
        {error && <Box className="m-auto color-red text-center pb-20">Something went wrong</Box>}
      </Box>
    </Modal>
  )
}

export default AddNewGroupQuestionModal
