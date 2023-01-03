import React, {useEffect, useState} from 'react'
import {Box, Button, CircularProgress} from '@mui/material'
import clsx from 'clsx'
import {useSearchParams} from 'react-router-dom'
import moment from 'moment'
// import CirclePercent from '../../layouts/circlePercent/circlePercent'
import SuccessModalSecond from '../../layouts/modal/successModalSecond'
import StepperPage from '../../layouts/stepper'
import EvaluatorsSteps from './evaluatorsSteps'
import FeedbacksStep from './feedbacksStep'
import useStyles from '../../assets/makeStyles/evaluatorsStep/evaluatorsStep'
// import MakeStyles from '../../assets/makeStyles/makeStyles'
import EvaluationApi from '../../api/evaluation'
import {UseFeedbackContext} from '../../context/feedbackContext/feedbackContext'
import {IFeedbackProps} from '../../context/feedbackContext/feedbackContext.props'
import {QuestionGroup, IQuestion} from '../../interfaces/evaulateEvent'
import RateSidebar from '../../layouts/rateEvaluateSidebar'
import ErrorModal from '../../layouts/modal/errorModal'
import {UseEvaluationContext} from '../../context/evalaution/evaluationContext'
import {IEvalautionProps} from '../../context/evalaution/evaluationContext.props'
import FeedBackApi from '../../api/feedback'
import useStylesButton from '../../assets/makeStyles/buttons/buttons'
import PopoverContainer from '../../layouts/popover/popover'

const Index = () => {
  const classesEvaluatorsStep = useStyles()
  // const classes = MakeStyles()
  const classesButtons = useStylesButton()

  const [openModalSuccess, setOpenModalSuccess] = useState(false)
  const [clickedNext, setClickedNext] = useState<boolean>(false)
  const [blockedNext, setBlockedNext] = useState<boolean>(false)

  const {
    setActiveUser,
    activeUser,
    userId,
    evaluatorsStepLength,
    evaluationUser,
    setEvaluationUser,
    setIsNegativeFeedbacks,
    setIsPositiveFeedbacks,
    setScorings,
    setDonePercent,
  } = UseEvaluationContext() as IEvalautionProps

  const [markWithText, setMarkWithText] = useState(false)
  const [step, setStep] = useState(0)
  const [steps, setSteps] = useState<string[] | number[]>([1, 2, 3, 4])
  const [activeStep, setActiveStep] = useState(0)
  const [openModalError, setOpenModalError] = useState(false)
  const [eventError, setEventError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [completed, setCompleted] = useState<{
    [k: number]: boolean
  }>({})
  const [showPopover, setShowPopover] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [disabledSubmitButton, setDisabledSubmitButton] = useState<boolean>(false)
  const [searchParameters] = useSearchParams()
  const [eventData, setEventData] = useState<
    | {
        dueDate: string
        evaluatees: {firstName: string; lastName: string}[]
        questionsGrouped: Record<number, IQuestion[]>
        ratePointFrom: number
        ratePointTo: number
      }
    | undefined
  >()
  const [questionAnswers, setQuestionAnswers] = useState<{
    [k: number]: number
  }>({})

  const handleCloseErrorModal = () => {
    setOpenModalError(false)
  }

  const [questionGroups, setQuestionGroups] = useState<QuestionGroup[]>([])
  const [feedbackOfQuestion, setFeedbackOfQuestion] = useState<{[k: number]: string}>()

  const {positiveFeedback, negativeFeedback, setPositiveFeedback, setNegativeFeedback} =
    UseFeedbackContext() as IFeedbackProps

  useEffect(() => {
    const searchParams: any[] = [...searchParameters.entries()]
    setIsLoading(true)
    const eventToken = searchParams.find(([paramName]) => paramName === 'event_token')[1]
    const userToken = searchParams.find(([paramName]) => paramName === 'user_token')[1]
    ;(async () => {
      if (userToken && eventToken) {
        const eventEvaluation: any = await EvaluationApi.getEventForEvaluation(
          userToken,
          eventToken,
        )
        if (eventEvaluation.status === 200) {
          setIsPositiveFeedbacks(eventEvaluation.data.isPositiveFeedbacks)
          setIsNegativeFeedbacks(eventEvaluation.data.isNegativeFeedbacks)
          setScorings(eventEvaluation.data.scorings)
          setEventData({
            ...eventEvaluation.data,
            questionsGrouped: eventEvaluation.data.questions.reduce(
              (acc: Record<number, IQuestion[]>, val: IQuestion) =>
                acc[val.questionGroupId]
                  ? {
                      ...acc,
                      [val.questionGroupId]: [...acc[val.questionGroupId], val],
                    }
                  : {
                      ...acc,
                      [val.questionGroupId]: [val],
                    },
              {},
            ),
          })
          setMarkWithText(eventEvaluation.data.evaluationType === 0)

          if (eventEvaluation.data.evaluationType === 0) {
            setQuestionAnswers(
              Object.fromEntries(
                eventEvaluation.data.questions.map((question: IQuestion) => [question.id, '']),
              ),
            )
          } else {
            setQuestionAnswers(
              Object.fromEntries(
                eventEvaluation.data.questions.map((question: IQuestion) => [question.id, '']),
              ),
            )
          }
        } else {
          setOpenModalError(true)
          setEventError(true)
          setErrorMessage(eventEvaluation.response.data.message || '')
        }
        setIsLoading(false)
      }
    })()
    ;(async () => {
      if (userToken && eventToken) {
        const questionGroupsData = await EvaluationApi.getQuestionGroups(userToken, eventToken)
        setQuestionGroups(questionGroupsData.data)
      }
    })()
  }, [searchParameters])

  const handleNext = () => {
    setClickedNext(true)
    if (!blockedNext) {
      setClickedNext(false)
      const newCompleted = completed
      newCompleted[activeStep] = true
      setCompleted(newCompleted)
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    if (activeStep === 0) {
      setStep(0)
    } else {
      const newCompleted = completed
      newCompleted[activeStep] = false
      setCompleted(newCompleted)
      setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
  }

  const handleCloseModal = () => setOpenModalSuccess(false)

  const handleClosePopover = () => {
    setShowPopover(false)
  }

  const handleSubmit = async () => {
    try {
      const searchParams: any[] = [...searchParameters.entries()]
      setIsLoading(true)

      const eventToken = searchParams.find(([paramName]) => paramName === 'event_token')[1]
      const userToken = searchParams.find(([paramName]) => paramName === 'user_token')[1]

      const response = await EvaluationApi.saveQuestionGroups({
        eventToken,
        userToken,
        evaluatorId: 0,
        evaluateeId: userId,
        questionPointArr: Object.entries(questionAnswers).map((questionPoints) => ({
          questionId: Number(questionPoints[0]),
          point: Number(questionPoints[1]),
          evaluationText: feedbackOfQuestion?.[Number(questionPoints[0])],
        })),
      })

      if (positiveFeedback.length) {
        await FeedBackApi.saveFeedbackArr({
          eventToken,
          userToken,
          eventId: 0,
          evaluatorId: 0,
          evaluateeId: userId,
          feedbackText: positiveFeedback,
          isPositive: 1,
        })
      }

      if (negativeFeedback.length) {
        await FeedBackApi.saveFeedbackArr({
          eventToken,
          userToken,
          eventId: 0,
          evaluatorId: 0,
          evaluateeId: userId,
          feedbackText: negativeFeedback,
          isPositive: 0,
        })
      }
      if (response.status === 200) {
        setOpenModalSuccess(true)
        setPositiveFeedback([])
        setNegativeFeedback([])

        const eventEvaluation = await EvaluationApi.getEventForEvaluation(userToken, eventToken)
        setQuestionAnswers(
          Object.fromEntries(
            eventEvaluation.data.questions.map((question: IQuestion) => [question.id, 0]),
          ),
        )
        setDonePercent(100 / (evaluatorsStepLength.length + 1 - activeUser))
        if (evaluatorsStepLength.length > activeUser) {
          setActiveUser(activeUser + 1)
          setStep(0)
          setCompleted({})
          setActiveStep(0)
        } else {
          setDisabledSubmitButton(true)
          setActiveUser(activeUser + 1)
          setStep(0)
          setCompleted({})
          setActiveStep(0)
          setEvaluationUser(undefined)
        }
        setIsLoading(false)
      } else {
        setOpenModalError(true)
        setErrorMessage('')
      }
      setShowPopover(true)
    } catch (e) {
      console.log(e, 'error')
    }
  }

  useEffect(() => {
    if (eventData && !eventData.evaluatees[0]) {
      setEventError(true)
    }
  }, [eventData])

  useEffect(() => {
    if (eventData) {
      setSteps(Object.keys(eventData.questionsGrouped))
    }
  }, [eventData])

  useEffect(() => {
    if (evaluatorsStepLength.length < activeUser) {
      setEventError(true)
    } else {
      setEventError(false)
    }
  }, [activeUser, evaluatorsStepLength])

  return (
    <Box className="evaluators-step-container">
      <RateSidebar />
      <Box className="d-flex flex-wrap justify-around align-center">
        <Box className="mr-30 mt-12 mb-10 font-size-20 font-weight-500 line-height-24 ">
          <Box className=" font-size-18 line-height-22 font-weight-400 d-flex">
            {evaluationUser ? (
              <Box className="d-flex align-center">
                <Box className="font-size-18 font-weight-700 color-dark-blue">
                  Evaluatee: {evaluationUser.name && evaluationUser.name}{' '}
                </Box>
                <Box className="color-light-gray2 ml-14 font-italic font-size-16">
                  {evaluationUser && evaluationUser.position ? evaluationUser.position : ''}
                </Box>
              </Box>
            ) : (
              <Box>There is no Data</Box>
            )}
          </Box>
        </Box>
        <Box className="d-flex flex-wrap align-center color-dark-blue">
          {eventData?.dueDate && (
            <Box className="mr-50 mt-12 mb-10">
              Evaluation due date:{' '}
              <Box component="span" className="bold font-size-18 line-height-22">
                {evaluationUser && moment(eventData.dueDate).format('YYYY-MM-DD')}
              </Box>
            </Box>
          )}
        </Box>
        {/*<Box className="d-flex mb-10">*/}
        {/*  <Box>*/}
        {/*    <CirclePercent percent={Math.floor(donePercent)} width={40} />*/}
        {/*  </Box>*/}
        {/*  <Box className="mr-36 mt-16">*/}
        {/*    <Box*/}
        {/*      className={`ml-16 font-size-12 font-weight-300 line-height-14 font-italic ${classes.colorGray}`}*/}
        {/*    >*/}
        {/*      {Math.floor(donePercent) <= 0*/}
        {/*        ? 'Not started yet'*/}
        {/*        : `${Math.floor(donePercent)}% done`}*/}
        {/*    </Box>*/}
        {/*  </Box>*/}
        {/*</Box>*/}
      </Box>
      {step === 0 && (
        <Box className="mt-142 d-flex justify-center align-center">
          <PopoverContainer
            open={showPopover}
            onClose={handleClosePopover}
            title="All done! Your evaluation form was submitted!"
          />
          {!isLoading ? (
            <Box className="d-flex align-center">
              <Box className={`${classesButtons.colorBlueButton} mr-10`}>
                <Button
                  variant="contained"
                  onClick={() => setStep(1)}
                  disabled={eventError}
                  color="blue"
                >
                  Start evaluation{' '}
                </Button>
              </Box>
              {/*<p className="ml-6 font-weight-800">*/}
              {/*  {evaluationUser && `for ${evaluationUser.name}`}*/}
              {/*</p>*/}
            </Box>
          ) : (
            <Box className="text-center m-auto w-100">
              <CircularProgress className="pt-12 pb-10" />
            </Box>
          )}
        </Box>
      )}
      {step === 1 && (
        <Box className="mt-60">
          <Box className="evaluation-stepper-container m-auto">
            <StepperPage
              stepperAllActive={false}
              steps={
                eventData?.questionsGrouped
                  ? [...Object.keys(eventData?.questionsGrouped), 'Last']
                  : []
              }
              completed={completed}
              activeStep={activeStep}
            />
          </Box>
          <Box className="mt-50">
            <Box className="evaluators-step-rating-container">
              {eventData?.questionsGrouped &&
                Object.keys(eventData?.questionsGrouped).map(
                  (questionGroupId, index) =>
                    activeStep === index && (
                      <EvaluatorsSteps
                        setBlockedNext={(value) => setBlockedNext(value)}
                        ratePointFrom={eventData.ratePointFrom}
                        ratePointTo={eventData.ratePointTo}
                        questionAnswers={questionAnswers}
                        markWithText={markWithText}
                        questions={eventData.questionsGrouped[questionGroupId as unknown as number]}
                        setFeedbackOfQuestion={(questionId: number, feedbackValue: string) => {
                          setFeedbackOfQuestion({
                            ...feedbackOfQuestion,
                            [questionId]: feedbackValue,
                          })
                        }}
                        setQuestionAnswers={(questionId: number, questionValue: number) => {
                          setQuestionAnswers({
                            ...questionAnswers,
                            [questionId]: questionValue,
                          })
                        }}
                        title={
                          questionGroups?.find(
                            (questionGroup) => questionGroup.id === Number(questionGroupId),
                          )?.questionGroupTitle || ''
                        }
                        key={questionGroupId}
                      />
                    ),
                )}
              {activeStep + 1 === steps.length + 1 && <FeedbacksStep />}
              {isLoading ? (
                <Box className="text-center m-auto w-100 evaluators-step-button-container-step-4">
                  <CircularProgress />
                </Box>
              ) : (
                <Box
                  className={`${
                    activeStep + 1 !== steps.length + 1
                      ? 'evaluators-step-button-container'
                      : 'evaluators-step-button-container-step-4'
                  } d-flex justify-center`}
                >
                  <Box className={`${classesButtons.transparentWithBorderButton} mb-10 mr-46`}>
                    <Button
                      className={clsx(classesEvaluatorsStep.normalSizeButton)}
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </Box>
                  {activeStep < steps.length && (
                    <Box className={`mb-10 ${classesButtons.colorBlueButton}`}>
                      <Button
                        variant="contained"
                        color="blue"
                        size="large"
                        className={` ${classesEvaluatorsStep.normalSizeButton}`}
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    </Box>
                  )}
                  {activeStep + 1 === steps.length + 1 && (
                    <Box className={`${classesButtons.colorBlueButton}`}>
                      <Button
                        onClick={() => handleSubmit()}
                        variant="contained"
                        color="blue"
                        size="large"
                        disabled={disabledSubmitButton}
                        className={` ${classesEvaluatorsStep.normalSizeButton}`}
                      >
                        Submit
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            {clickedNext && blockedNext && (
              <Box className="error-message">Please select value for all questions</Box>
            )}
          </Box>
        </Box>
      )}
      <SuccessModalSecond openModal={openModalSuccess} closeModal={handleCloseModal} />
      <ErrorModal
        errorMessage={errorMessage}
        openModal={openModalError}
        closeModal={handleCloseErrorModal}
      />
    </Box>
  )
}

export default Index
