import React, {Dispatch, useEffect, useState} from 'react'
import {Box, Button, Checkbox, FormControlLabel, FormGroup, TextField} from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CircularProgress from '@mui/material/CircularProgress'
import {useLocation} from 'react-router'
import AddModal from '../../../layouts/modal/addModal'
import ButtonDropDown from '../../../layouts/tooltip'
import MakeStyles from '../../../assets/makeStyles/makeStyles'
import {UseCreateEventContext} from '../../../context/createEventContext/createEventContext'
import {ICreateEventProps} from '../../../context/createEventContext/createEventContext.props'
import QuestionApi from '../../../api/question'
import {IQuestionGroupTitle, IQuestions} from '../../../shared/types/events/events'
import DeleteIcon from '../../../assets/images/Icons/deleteIcon'
import EventQuestionApi from '../../../api/eventQuestion'
import useStylesTextFields from '../../../assets/makeStyles/textFields/textFields'
import useStylesIcon from '../../../assets/makeStyles/icons/icons'
import AddNewGroupQuestionModal from '../../../layouts/modal/addNewGroupQuestionModal'
import EditIcon from '../../../assets/images/Icons/editIcon_2'
import ButtonBlue from '../../../layouts/buttons/buttonBlue'

const Step3 = ({
  afterStartEvent,
  error,
  setIsQuestionsLoading,
  isQuestionsLoading,
  fullQuestions,
  view,
  setNextStep,
}: {
  afterStartEvent: boolean
  error: boolean
  setIsQuestionsLoading: Dispatch<React.SetStateAction<boolean>>
  isQuestionsLoading: boolean
  fullQuestions: IQuestions[]
  view: boolean
  setNextStep: Dispatch<React.SetStateAction<boolean>>
}) => {
  const stylesIcon = useStylesIcon()
  const classes = MakeStyles()
  const location = useLocation()
  const stateLocation = location.state as {id: number; createNewEvent: boolean}
  const classesTextFields = useStylesTextFields()

  const [withOutRatingCount, setWithOutRatingCount] = useState<boolean>(true)
  const [errorUpdateQuestion, setErrorUpdateQuestion] = useState<boolean>(false)
  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [openQuestionGroupModal, setOpenQuestionGroupModal] = useState<boolean>(false)
  const [errorGroupQuestion, setErrorGroupQuestion] = useState(false)

  const {
    setQuestions,
    questions,
    setQuestionsId,
    customNotesQuestion,
    deletedSubQuestions,
    setDeletedSubQuestions,
    setCustomNotesQuestion,
    setQuestionGroupTitleIsDefault,
    questionGroupTitleIsDefault,
    questionGroupTitle,
    setQuestionGroupTitle,
  } = UseCreateEventContext() as ICreateEventProps
  const [allCheckedFeedbacks, setAllCheckedFeedbacks] = useState<boolean>(true)
  const [groupId, setGroupId] = useState<number>(0)
  const [ratingEvaluation, setRatingEvaluation] = useState<number>(0)
  const [groupRatingOfTitle, setGroupRatingOfTitle] = useState<number>(0)
  const [isEdited, setIsEdited] = useState<boolean>(false)
  const [questionTitle, setQuestionTitle] = useState('')
  const [questionDescription, setQuestionDescription] = useState('')
  const [ratingOfQuestion, setRatingOfQuestion] = useState('')
  const [questionGroupId, setQuestionGroupId] = useState<number>(0)
  const [questionTitleId, setQuestionTitleId] = useState<number>(0)
  const [isComponentRerendered, setIsComponentRerendered] = useState<boolean>(false)
  const [isLoadingCheckedFeedback, setIsLoadingCheckedFeedback] = useState<boolean>(false)
  const [isLoadingCheckedFeedbackId, setIsLoadingCheckedFeedbackId] = useState<number>()

  useEffect(() => {
    if (questions.length) {
      setNextStep(true)
    } else {
      setNextStep(false)
    }
  }, [questions])

  useEffect(() => {
    ;(async () => {
      setIsQuestionsLoading(true)

      if (!stateLocation.createNewEvent) {
        if (!questions.length) {
          const response2 = await EventQuestionApi.getEventQuestionsList(stateLocation.id)
          const updateQuestions = response2.data.map(
            (item: {
              questionId: number
              question: {
                questionTitle: string
                questionGroupId: number
                id: number
                questionDescription: string
                coefficient: number
              }
            }) => ({
              id: item.questionId,
              questionGroupId: item.question.questionGroupId,
              questionTitle: item.question.questionTitle,
              questionDescription: item.question.questionDescription,
              coefficient: item.question.coefficient,
            }),
          )

          setQuestions(updateQuestions)
          setQuestionsId(response2.data.map((item: {id: number}) => item.id))
        }
      } else if (!questions.length) {
        const response2 = await QuestionApi.getQuestionsList()
        // setQuestions(response2.data.map((item: IQuestions) => ({...item, isEdit: false})))
        setQuestionsId(response2.data.map((item: {id: number}) => item.id))

        const questionGroupOfId = questionGroupTitle.map((item) => item.id)
        const updateQuestion = response2.data
          .filter((item: IQuestions) => questionGroupOfId.includes(item.questionGroupId))
          .map((item: IQuestions) => ({...item, isEdit: false}))
        setQuestions(updateQuestion)
      }
      setIsQuestionsLoading(false)
    })()
  }, [])

  useEffect(() => {
    if (!stateLocation.createNewEvent) {
      const updateDeletedSubQuestions = fullQuestions.filter((item) => {
        if (filterItems(item, questions)) {
          return null
        }
        return item
      })
      setDeletedSubQuestions(updateDeletedSubQuestions)
    }
  }, [questions])

  useEffect(() => {
    ratingResult()
  }, [questions])

  useEffect(() => {
    const groupRating = questionGroupTitle.map((group) => {
      if (group.id === groupId) {
        return {...group, ratingCount: groupRatingOfTitle}
      }
      return group
    })
    setQuestionGroupTitle(groupRating)
  }, [groupRatingOfTitle])

  useEffect(() => {
    changeQuestionTitle()
  }, [isEdited])

  const handleCloseAddModal = () => setOpenModalAdd(false)

  const handleCloseAddGroupModal = () => {
    setErrorGroupQuestion(false)
    setOpenQuestionGroupModal(false)
  }

  const handleDeleteQuestionGroup = (id: number) => {
    setQuestions(
      questions.filter((item) => {
        if (item.id !== id) {
          return item
        }
        setDeletedSubQuestions([...deletedSubQuestions, item])
        return null
      }),
    )
  }

  const filterItems = (item: IQuestions, questionsItem: IQuestions[]) => {
    const bool = questionsItem.map((obj) => obj.id === item.id)
    return bool.indexOf(true) > -1
  }

  const handleQuestionsApply = (checkedSubquestions: IQuestions[]) => {
    setIsQuestionsLoading(true)
    if (checkedSubquestions) {
      setDeletedSubQuestions([
        ...deletedSubQuestions.filter((item) => !checkedSubquestions.includes(item)),
      ])

      setQuestions([...questions, ...checkedSubquestions])
    }
    setIsQuestionsLoading(false)
  }

  useEffect(() => {
    if (questions) {
      setIsComponentRerendered(true)
    }
  }, [questions])

  const handleAddNewSubQuestions = async (
    subQuestions: string,
    description: string,
    questionIdGroup: number,
  ) => {
    const response = await QuestionApi.createQuestion(
      subQuestions,
      description,
      questionIdGroup,
      true,
    )
    setDeletedSubQuestions([response.data, ...deletedSubQuestions])
  }

  const handleAddGroupQuestion = async (value: IQuestionGroupTitle[]) => {
    setIsQuestionsLoading(true)
    // setQuestionGroupTitle([...questionGroupTitle, ...value])

    const response = await QuestionApi.getQuestionsList()

    const questionGroupOfId = value.map((item) => item.id)
    const questionItemId = questions.map((item) => item.id)

    // const updateQuestionGroup = questionGroupTitleIsDefault
    //   .filter((item) => !questionGroupOfId.includes(item.id))
    //   .map((item) => item)

    const updateQuestions = response.data
      .filter(
        (item: {questionGroupId: number; id: number; questionGroup: {applyDefault: boolean}}) =>
          !!(questionGroupOfId.includes(item.questionGroupId) && !questionItemId.includes(item.id)),
      )
      .map((item: {questionGroup: {applyDefault: boolean}}) => ({
        ...item,
        questionGroup: {...item.questionGroup, applyDefault: true},
      }))

    setQuestions([...questions, ...updateQuestions])
    // setQuestionGroupTitleIsDefault([...updateQuestionGroup])
    setErrorGroupQuestion(false)
    setIsQuestionsLoading(false)
  }

  const handleCheckedCustomNodes = () => {
    const updateCustomNotesQuestion = customNotesQuestion.map((item) => ({
      ...item,
      checked: !allCheckedFeedbacks,
    }))
    setAllCheckedFeedbacks(!allCheckedFeedbacks)
    setCustomNotesQuestion(updateCustomNotesQuestion)
  }

  const handleChangeChecked = (id: number) => {
    const updateCustomNotesQuestion = customNotesQuestion.map((item) => {
      if (id === item.id) {
        return {...item, checked: !item.checked}
      }
      return item
    })

    setCustomNotesQuestion(updateCustomNotesQuestion)
  }

  const handleCheckedFeedback = async ({
    id,
    itemQuestionId,
    questionTitleProps,
    questionDescriptionProps,
    ratingProps,
    checked,
  }: {
    id: number
    itemQuestionId: number
    questionTitleProps: string
    questionDescriptionProps: string
    ratingProps: string
    checked: boolean
  }) => {
    setIsLoadingCheckedFeedbackId(itemQuestionId)
    setIsLoadingCheckedFeedback(true)
    const response = await QuestionApi.updateQuestion({
      id: itemQuestionId,
      questionTitle: questionTitleProps,
      questionDescription: questionDescriptionProps,
      rating: ratingProps,
      questionId: id,
      applyQuestionDescription: checked,
    })
    console.log(response, 'response')
    const response2 = await QuestionApi.getQuestionsList()
    setQuestionsId(response2.data.map((item: {id: number}) => item.id))

    const questionGroupOfId = questionGroupTitle.map((item) => item.id)
    const updateQuestion = response2.data
      .filter((item: IQuestions) => questionGroupOfId.includes(item.questionGroupId))
      .map((item: IQuestions) => ({...item, isEdit: false}))
    setQuestions(updateQuestion)
    setIsLoadingCheckedFeedback(false)
  }

  const updateRating = (id: number, assessmentId: number, value: string) => {
    if (Number(value) > 10 || Number(value) < 0) {
      setErrorUpdateQuestion(true)
    } else {
      setErrorUpdateQuestion(false)
    }

    questionGroupTitle.forEach((group) => {
      if (group.id === id) {
        const result = questions.map((rating) => {
          if (rating.id === assessmentId) {
            return {...rating, coefficient: value}
          }
          return rating
        })
        setQuestions(result)
      }
    })
    setRatingEvaluation(assessmentId)
    setGroupId(id)
  }

  const ratingResult = () => {
    questionGroupTitle.forEach((group) => {
      if (group.id === groupId) {
        const result = questions
          .map((rating) => {
            if (group.id === Number(rating.questionGroupId)) {
              if (rating?.coefficient) {
                if (Number(rating?.coefficient) <= 10 || Number(rating?.coefficient) >= 0)
                  return Number(rating?.coefficient)
              }
            }
            return undefined
          })
          .filter((i) => i !== undefined) as number[]
        const groupRating = result.reduce((p, c) => p + c, 0)
        questions.forEach((item) => {
          if (item.id === ratingEvaluation) {
            setGroupRatingOfTitle(groupRating)
          }
        })
      }
    })
  }

  const handleRatingCount = () => {
    setWithOutRatingCount(!withOutRatingCount)
  }

  const editQuestionTitle = (id: number, questionId: number, text: string) => {
    setQuestionTitle(text)
    questionGroupTitle.forEach((group) => {
      if (group.id === id) {
        const result = questions.map((item) => {
          if (item.id === questionId) {
            return {...item, questionTitle: text}
          }
          return item
        })
        setQuestions(result)
      }
    })
  }

  const editQuestionDescription = (id: number, questionId: number, text: string) => {
    setQuestionDescription(text)
    questionGroupTitle.forEach((group) => {
      if (group.id === id) {
        const result = questions.map((item) => {
          if (item.id === questionId) {
            return {...item, questionDescription: text}
          }
          return item
        })
        setQuestions(result)
      }
    })
  }

  const handleEditTitle = (id: number, questionId: number, edited: boolean) => {
    questionGroupTitle.forEach((group) => {
      if (group.id === id) {
        const result = questions.map((item) => {
          if (item.id === questionId) {
            setRatingOfQuestion(item?.coefficient || '1')
            setIsEdited(!edited)
            setGroupId(id)
            setQuestionGroupId(id)
            setQuestionTitleId(questionId)

            return {...item, isEdit: !edited}
          }
          return {...item, isEdit: false}
        })
        setQuestions(result)
      }
    })
  }

  const changeQuestionTitle = async () => {
    if (!isEdited && questionGroupId !== 0) {
      await QuestionApi.updateQuestion({
        id: questionTitleId,
        questionTitle,
        questionDescription,
        rating: ratingOfQuestion,
        questionId: questionGroupId,
      })
    }
  }

  const handleDeleteGroupQuestion = async (itemProps: IQuestionGroupTitle) => {
    setQuestionGroupTitle(questionGroupTitle.filter((item) => item.id !== itemProps.id))
    setQuestions(questions.filter((item) => item.questionGroupId !== itemProps.id && item))
    setDeletedSubQuestions([
      ...deletedSubQuestions.filter((item) => item.questionGroupId !== itemProps.id),
    ])
    setQuestionGroupTitleIsDefault([...questionGroupTitleIsDefault, itemProps])
    await QuestionApi.updateQuestionGroup({...itemProps, applyDefault: false})
  }

  useEffect(() => {
    changeQuestionTitle()
  }, [isEdited])

  return (
    isComponentRerendered && (
      <Box>
        <Box className="create-event-of-step-heading">
          <Box className="button-item font-size-18 font-weight-500 d-flex align-center line-height-22 d-flex">
            <ButtonBlue
              disabled={afterStartEvent || view}
              handleClick={handleRatingCount}
              padding="padding16"
              title={withOutRatingCount ? 'without rating Count' : 'with rating count'}
            />
          </Box>
          <ButtonBlue
            disabled={afterStartEvent || view}
            handleClick={() => setOpenQuestionGroupModal(true)}
            title="Add Criteria"
            width="width150"
          />
          <AddModal openModal={openModalAdd} closeModal={handleCloseAddModal} />
        </Box>
        <Box className="choose-evaluation-criteria-container">
          {isQuestionsLoading ? (
            <div className="d-flex justify-center m-auto mt-20">
              <CircularProgress />
            </div>
          ) : (
            questionGroupTitle.map(
              (item) =>
                item.applyDefault && (
                  <Box key={item.id} className="choose-evaluation-criteria-column mt-14">
                    <Box className="choose-evaluation-criteria">
                      <FormGroup className="choose-evaluation-criteria-group align-center">
                        <Box className="font-size-16 font-weight-700 line-height-22 color-dark-blue d-flex">
                          <Box className="mr-40">{item.questionGroupTitle} </Box>
                          <Box>
                            {withOutRatingCount && (`-${item.ratingCount}` ? item.ratingCount : 0)}
                          </Box>
                        </Box>
                        <Box className="d-flex align-center">
                          <ButtonDropDown
                            view={view}
                            afterStartEvent={afterStartEvent}
                            buttonText="Add sub criteria"
                            tooltip="checkbox"
                            deletedSubQuestions={deletedSubQuestions}
                            handleAddNewSubQuestions={handleAddNewSubQuestions}
                            applyAddFromTo={null}
                            questionGroupId={item.id}
                            handleQuestionsApplyProps={handleQuestionsApply}
                          />
                          <Box className="ml-10">
                            <Button
                              disabled={afterStartEvent || view}
                              onClick={() => handleDeleteGroupQuestion(item)}
                            >
                              <DeleteIcon />
                            </Button>
                          </Box>
                        </Box>
                      </FormGroup>
                      <FormGroup className="choose-evaluation-criteria-group-checkboxes">
                        {questions.map((itemQuestion) => {
                          if (itemQuestion.questionGroupId === item.id) {
                            return (
                              <Box key={itemQuestion.id} className="checkboxLabel mb-50 mt-10">
                                <Box className="mr-10 d-flex align-center">
                                  <Box className={stylesIcon.smallIcon}>
                                    <CircleIcon fontSize="small" />
                                  </Box>
                                  {!itemQuestion.isEdit ? (
                                    <Box className="ml-16 color-dark-blue">
                                      <Box>{itemQuestion.questionTitle}</Box>
                                      <Box className="mt-20">
                                        {itemQuestion.questionDescription}
                                      </Box>
                                      <Box className="mt-20 d-flex align-center">
                                        <FormGroup>
                                          <FormControlLabel
                                            control={
                                              <Checkbox
                                                color="default"
                                                onClick={() =>
                                                  !view &&
                                                  handleCheckedFeedback({
                                                    id: item.id,
                                                    itemQuestionId: itemQuestion.id,
                                                    checked: !itemQuestion.applyQuestionDescription,
                                                    questionDescriptionProps:
                                                      itemQuestion.questionDescription,
                                                    questionTitleProps: itemQuestion.questionTitle,
                                                    ratingProps: itemQuestion.coefficient,
                                                  })
                                                }
                                                className={`${classes.checkboxColor}`}
                                                checked={itemQuestion.applyQuestionDescription}
                                              />
                                            }
                                            label={
                                              <Box className="font-size-16 font-weight-500 line-height-22 color-dark-blue">
                                                Feedback
                                              </Box>
                                            }
                                          />
                                        </FormGroup>
                                        <Box>
                                          {isLoadingCheckedFeedback &&
                                            itemQuestion.id === isLoadingCheckedFeedbackId && (
                                              <CircularProgress />
                                            )}
                                        </Box>
                                      </Box>
                                    </Box>
                                  ) : (
                                    <Box className="ml-16 color-dark-blue">
                                      <Box>
                                        <TextField
                                          maxRows={4}
                                          multiline
                                          label="Title"
                                          className="border-radius-30 background-input text-field"
                                          value={itemQuestion.questionTitle}
                                          onChange={(e) =>
                                            editQuestionTitle(
                                              item.id,
                                              itemQuestion.id,
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </Box>
                                      <Box className="mt-20">
                                        <TextField
                                          maxRows={4}
                                          multiline
                                          label="Description"
                                          className="border-radius-30 background-input text-field"
                                          value={itemQuestion.questionDescription}
                                          onChange={(e) =>
                                            editQuestionDescription(
                                              item.id,
                                              itemQuestion.id,
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </Box>
                                    </Box>
                                  )}
                                </Box>
                                <Box className="icons-container d-flex justify-end">
                                  <Box
                                    className="d-flex justify-end align-center"
                                    minWidth={190}
                                    maxWidth={190}
                                  >
                                    {withOutRatingCount && (
                                      <Box className="mr-10">
                                        <TextField
                                          size="small"
                                          disabled={afterStartEvent || view}
                                          className={`${classesTextFields.numberRemoveArrowUpDown}`}
                                          type="number"
                                          placeholder="0"
                                          value={itemQuestion.coefficient}
                                          InputProps={{inputProps: {min: 0, max: 10}}}
                                          error={
                                            itemQuestion.coefficient
                                              ? Number(itemQuestion.coefficient) > 10 ||
                                                Number(itemQuestion.coefficient) < 0
                                              : false
                                          }
                                          onChange={(e) =>
                                            updateRating(item.id, itemQuestion.id, e.target.value)
                                          }
                                        />
                                      </Box>
                                    )}
                                    <Button
                                      disabled={afterStartEvent || view}
                                      onClick={() => handleDeleteQuestionGroup(itemQuestion.id)}
                                    >
                                      <DeleteIcon />
                                    </Button>
                                    {!itemQuestion.isEdit ? (
                                      <Button
                                        disabled={afterStartEvent || view}
                                        className="cursor-pointer width-20"
                                        onClick={() =>
                                          handleEditTitle(
                                            item.id,
                                            itemQuestion.id,
                                            itemQuestion.isEdit,
                                          )
                                        }
                                      >
                                        <EditIcon />
                                      </Button>
                                    ) : (
                                      <Button
                                        disabled={afterStartEvent || view}
                                        className="cursor-pointer width-20"
                                        onClick={() =>
                                          !errorUpdateQuestion &&
                                          handleEditTitle(
                                            item.id,
                                            itemQuestion.id,
                                            itemQuestion.isEdit,
                                          )
                                        }
                                      >
                                        <CheckCircleOutlineIcon />
                                      </Button>
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            )
                          }
                          return null
                        })}
                      </FormGroup>
                    </Box>
                  </Box>
                ),
            )
          )}
          <Box key={4} className="choose-evaluation-criteria-column mt-14">
            <Box className="choose-evaluation-criteria">
              <FormGroup className="choose-evaluation-criteria-group align-center">
                <FormControlLabel
                  control={
                    <Checkbox
                      color="default"
                      onClick={() => !view && handleCheckedCustomNodes()}
                      className={`${classes.checkboxColor}`}
                      checked={allCheckedFeedbacks}
                    />
                  }
                  label={
                    <Box className="font-size-16 font-weight-500 line-height-22 color-dark-blue">
                      Custom Notes
                    </Box>
                  }
                />
              </FormGroup>
              <FormGroup className="choose-evaluation-criteria-group-checkboxes">
                {customNotesQuestion.map((itemQuestion) => (
                  <FormControlLabel
                    key={itemQuestion.id}
                    control={
                      <Checkbox
                        defaultChecked
                        color="default"
                        onClick={() => !view && handleChangeChecked(itemQuestion.id)}
                        checked={itemQuestion.checked}
                        className={`${classes.checkboxColor}`}
                      />
                    }
                    label={<Box className="checkboxLabel">{itemQuestion.questionName}</Box>}
                  />
                ))}
              </FormGroup>
            </Box>
          </Box>
        </Box>
        <AddNewGroupQuestionModal
          openModal={openQuestionGroupModal}
          closeModal={handleCloseAddGroupModal}
          handleSaveDetailsProps={handleAddGroupQuestion}
          loading={isQuestionsLoading}
          setLoading={setIsQuestionsLoading}
          error={errorGroupQuestion}
          dataProps={questionGroupTitleIsDefault}
        />
        <Box className="color-red mt-20">{error && 'Please fill out required fields'}</Box>
      </Box>
    )
  )
}

export default Step3
