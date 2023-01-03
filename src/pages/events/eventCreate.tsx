import React, {useEffect, useState} from 'react'
import {Box, CircularProgress} from '@mui/material'
import {Link} from 'react-router-dom'
import {useLocation, useNavigate} from 'react-router'
import moment from 'moment'
import uuid from 'react-uuid'
import StepperPage from '../../layouts/stepper'
import SuccessModal from '../../layouts/modal/successModal'
import Step1 from './steps/step1'
import Step3 from './steps/step3'
import MakeStyles from '../../assets/makeStyles/makeStyles'
import EventsApi from '../../api/events'
import {UseCreateEventContext} from '../../context/createEventContext/createEventContext'
import {IEventEvaluators, IQuestions} from '../../shared/types/events/events'
import {ICreateEventProps} from '../../context/createEventContext/createEventContext.props'
import {UseUserContext} from '../../context/userContext/userContext'
import {IUserProps} from '../../context/userContext/userContext.props'
import ErrorModal from '../../layouts/modal/errorModal'
import QuestionApi from '../../api/question'
import getUserList from '../utils/usersUtils'
import Step2 from './steps/step2'
import Step4 from './steps/step4'
import ScoringsApi from '../../api/scoring'
import LeftIcon from '../../assets/images/Icons/leftIcon'
import BonusesApi from '../../api/bonus'
import Step5 from './steps/step5'
import ButtonBlue from '../../layouts/buttons/buttonBlue'
import ButtonTranparentBorder from '../../layouts/buttons/buttonTransparentBorder'

const EventCreate = () => {
  const classes = MakeStyles()
  const location = useLocation()
  const navigate = useNavigate()
  const stateLocation = location.state as {
    createNewEvent?: boolean
    id: number
    view: boolean
    clone: boolean
    edit: boolean
  }
  const {
    eventTitle,
    startDate,
    endDate,
    ratePointFrom,
    setCustomNotesQuestion,
    ratePointTo,
    setRatePointFrom,
    setRatePointTo,
    setStartDate,
    setEndDate,
    questions,
    customNotesQuestion,
    setEventEvaluatee,
    setEventEvaluator,
    setEventTitle,
    checkedIdOfEvaluator,
    checkedIdOfEvaluatee,
    setCheckedIdOfEvaluator,
    setCheckedIdOfEvaluatee,
    setCheckedItemOfEvaluator,
    setCheckedItemOfEvaluatee,
    setCheckedOfEvaluatee,
    setQuestionsId,
    setQuestions,
    setWithScores,
    withScores,
    checkedOfEvaluatee,
    buttonsOfValue,
    setButtonsOfValue,
    rangesOfvalue,
    setRangesOfValue,
    setQuestionGroupTitleIsDefault,
    setQuestionGroupTitle,
    setRangeMin,
    setRangeMax,
    rangeMax,
    rangeMin,
    setErrorDate,
    setErrorEventTitle,
    setErrorEvaluators,
    setErrorEvaluatees,
    setErrorCheckedOfEvaluatee,
    eventEvaluator,
    eventEvaluatee,
  } = UseCreateEventContext() as ICreateEventProps
  const {userId, setUserId} = UseUserContext() as IUserProps

  const [view, setView] = useState<boolean>(false)
  const [clone, setClone] = useState<boolean>(false)
  const [getEvaluatorEvaluatee, setGetEvaluatorEvaluatee] = useState<boolean>(false)
  const [nextStep, setNextStep] = useState<boolean>(false)
  const [fullQuestions, setFullQuestions] = useState<IQuestions[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [error, setError] = useState<boolean>(false)

  const [openModalError, setOpenModalError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isQuestionsLoading, setIsQuestionsLoading] = useState<boolean>(false)
  const [steps, setSteps] = useState<number[]>([1, 2, 3, 4, 5, 6])
  const [activeStep, setActiveStep] = useState<number>(0)
  const [completed, setCompleted] = useState<{
    [k: number]: boolean
  }>({})
  const [clickedNext, setClickedNext] = useState<boolean>(false)
  const [openModalSuccess, setOpenModalSuccess] = useState<boolean>(false)
  const [afterStartEvent, setAfterStartEvent] = useState<boolean>(false)

  useEffect(() => {
    ;(async () => {
      setCheckedOfEvaluatee([])
      setQuestionsId([])
      setQuestions([])
      setActiveStep(0)
      if (!stateLocation.createNewEvent) {
        await getEventList()
        setSteps([1, 2, 3, 4, 5])
        if (stateLocation.clone) {
          setView(false)
          setStartDate('')
          setEndDate('')
          setClone(true)
          setGetEvaluatorEvaluatee(true)
        } else if (stateLocation.view) {
          setView(true)
          setClone(false)
          setGetEvaluatorEvaluatee(true)
        } else if (stateLocation.edit) {
          setClone(false)
          setGetEvaluatorEvaluatee(true)
        }
      } else {
        setSteps([1, 2, 3, 4, 5, 6])
        setRatePointFrom('1')
        setRatePointTo('10')
        setStartDate('')
        setEndDate('')
        setEventTitle('')
        setGetEvaluatorEvaluatee(false)
        setCustomNotesQuestion([
          {
            id: 1,
            questionName: 'Positive Feedback',
            checked: true,
          },
          {
            id: 2,
            questionName: 'Things To Improve',
            checked: true,
          },
        ])
        setEventEvaluatee([])
        setEventEvaluator([])
        setCheckedIdOfEvaluator([])
        setCheckedIdOfEvaluatee([])
        setCheckedItemOfEvaluator([])
        setCheckedItemOfEvaluatee([])
        setCompleted([])
        setView(false)
        setButtonsOfValue([
          {
            id: uuid(),
            scoringName: 'Good',
            scoringValue: '1',
            edit: false,
          },
          {
            id: uuid(),
            scoringName: 'Very Good',
            scoringValue: '2',
            edit: false,
          },
          {
            id: uuid(),
            scoringName: 'Excellent',
            scoringValue: '3',
            edit: false,
          },
        ])
        setRangesOfValue([
          {
            id: uuid(),
            bonusRangeFrom: '0',
            bonusRangeTo: '10',
            bonusPercentage: '0',
            bonusRangeName: 'Good',
          },
          {
            id: uuid(),
            bonusRangeFrom: '0',
            bonusRangeTo: '15',
            bonusPercentage: '20',
            bonusRangeName: 'Very Good',
          },
          {
            id: uuid(),
            bonusRangeFrom: '0',
            bonusRangeTo: '5',
            bonusPercentage: '35',
            bonusRangeName: 'Normal',
          },
        ])
        setClone(false)
      }
    })()
  }, [stateLocation])

  useEffect(() => {
    if (!userId) {
      setUserId(Number(localStorage.userId))
    }
  }, [userId])

  useEffect(() => {
    ;(async () => {
      const response = await QuestionApi.getQuestionsGroups()
      setQuestionGroupTitle(
        response.data.map((item: {applyDefault: boolean}) => item.applyDefault && item),
      )
      setQuestionGroupTitleIsDefault(
        response.data
          .filter((item: {applyDefault: boolean}) => !item.applyDefault)
          .map((item: {applyDefault: boolean}) => item),
      )
    })()
  }, [])

  const getEventList = async () => {
    setIsLoading(true)
    try {
      const result = await EventsApi.getEvent(stateLocation.id)
      const result2 = await ScoringsApi.getScoringList(stateLocation.id)
      const result3 = await BonusesApi.getEventBonuses(stateLocation.id)
      const result4 = await BonusesApi.getEventSumEvaluation(stateLocation.id)

      setRangeMin(result4.data.sumMin)
      setRangeMax(result4.data.sumMax)

      if (stateLocation.edit) {
        if (moment(result.data.startDate).isBefore()) {
          setAfterStartEvent(true)
        } else {
          setAfterStartEvent(false)
        }
      }

      setRatePointFrom(result.data.ratePointFrom)
      setRatePointTo(result.data.ratePointTo)
      setStartDate(result.data.startDate)
      setButtonsOfValue(
        result2.data.map(
          (
            item: {
              edit: boolean
            }[],
          ) => ({...item, edit: false}),
        ),
      )
      setRangesOfValue(result3.data)
      setEndDate(result.data.dueDate)
      setWithScores(result.data.evaluationType === 1)
      setEventTitle(result.data.eventTitle)
      setQuestionsId(result.data.questionId)
      setCustomNotesQuestion([
        {
          id: 1,
          questionName: 'Positive Feedback',
          checked: result.data.isPositiveFeedbacks,
        },
        {
          id: 2,
          questionName: 'Things To Improve',
          checked: result.data.isNegativeFeedbacks,
        },
      ])

      if (result.data.eventEvaluators.length) {
        const updateEventEvaluator = await Promise.all(
          result.data.eventEvaluators.map(async (item: IEventEvaluators) => getUserList(item)),
        )
        const updateCheckedIdOfEvaluator = result.data.eventEvaluators
          .filter((item: IEventEvaluators) => {
            if (item.userId) {
              return true
            }
            return false
          })
          .map((item: IEventEvaluators) => ({evaluatorId: item.userId}))
        setCheckedItemOfEvaluator(updateEventEvaluator)
        setCheckedIdOfEvaluator(updateCheckedIdOfEvaluator)
      }

      const getQuestions = await QuestionApi.getQuestionsList()
      setFullQuestions(getQuestions.data)

      if (result.data.eventEvaluatees.length) {
        const updateEventEvaluatee = await Promise.all(
          result.data.eventEvaluatees.map(async (item: IEventEvaluators) => getUserList(item)),
        )
        const newEventEvaluatee = updateEventEvaluatee.map((item) => ({
          evaluateeId: item.id,
          userName: item.userName,
        }))
        const updateCheckedIdOfEvaluatee = result.data.eventEvaluatees
          .filter((item: IEventEvaluators) => {
            if (item.userId) {
              return true
            }
            return false
          })
          .map((item: IEventEvaluators) => ({evaluateeId: item.userId}))
        setCheckedItemOfEvaluatee(newEventEvaluatee)
        setCheckedIdOfEvaluatee(updateCheckedIdOfEvaluatee)
      }

      setIsLoading(false)
    } catch (e) {
      console.log(e, 'error')
    }
    setIsLoading(false)
  }

  const completedSteps = async () => {
    if (nextStep) {
      setError(false)
      const questionsIdPost = questions.map((item: {id: number}) => ({questionId: item.id}))
      try {
        setIsLoading(true)
        const newArrayEvalautorEvaluatees: {evaluatorId?: number; evaluateeId: number}[] = []

        checkedOfEvaluatee.forEach((item) => {
          newArrayEvalautorEvaluatees.push({
            evaluatorId: item.evaluatorId,
            evaluateeId: item.evaluateeId,
          })
        })
        const data = {
          eventTitle,
          createdDate: moment(),
          startDate: moment(startDate).hours(15).format(),
          dueDate:
            startDate === endDate
              ? moment(endDate).endOf('day').format()
              : moment(endDate).format(),

          isPublish: true,
          isDelete: false,
          evaluationType: withScores ? 1 : 0,
          isPositiveFeedbacks: customNotesQuestion[0].checked,
          isNegativeFeedbacks: customNotesQuestion[1].checked,
          questions: questionsIdPost,
          evaluators: checkedIdOfEvaluator.map((item) => ({userId: item.evaluatorId})),
          evaluatees: checkedIdOfEvaluatee.map((item) => ({userId: item.evaluateeId})),
          ...(withScores && {ratePointFrom}),
          ...(withScores && {ratePointTo}),
        }
        const response = await EventsApi.createEvent(data)
        if (response.status === 200) {
          const response2 = await EventsApi.createEventEvaluatorEvaluatees({
            eventId: response.data.id,
            evaluatorEvaluateeArr: newArrayEvalautorEvaluatees,
          })

          const scoringsData = buttonsOfValue.map((item) => ({
            scoringValue: item.scoringValue,
            scoringName: item.scoringName,
            eventId: response.data.id,
          }))

          const response3 = await ScoringsApi.createScoring({
            eventId: response.data.id,
            scoringArr: scoringsData,
          })

          const response4 = await BonusesApi.createBonus({
            eventId: response.data.id,
            bonusArr: [
              ...rangesOfvalue.map((item) => ({
                eventId: response.data.id,
                bonusPercentage: Number(item.bonusPercentage),
                bonusRangeFrom: Number(item.bonusRangeFrom),
                bonusRangeTo: Number(item.bonusRangeTo),
                bonusRangeName: item.bonusRangeName,
              })),
            ],
          })

          if (response2.status === 200 && response3.status === 200 && response4.status === 200) {
            setOpenModalSuccess(true)
            setStartDate('')
            setEndDate('')
            setEventEvaluatee([])
            setEventEvaluator([])
            setCheckedIdOfEvaluatee([])
            setCheckedIdOfEvaluator([])
            setEventTitle('')
          }
        } else {
          setOpenModalError(true)
        }
        setIsLoading(false)
      } catch (e) {
        setIsLoading(false)
        console.log(e, 'error')
      } finally {
        setIsLoading(false)
      }
    } else {
      setError(true)
    }
  }

  const handleSave = async () => {
    if (nextStep) {
      setError(false)
      setIsLoading(true)
      const questionsIdPost = questions.map((item: {id: number}) => ({questionId: item.id}))
      const data = {
        eventTitle,
        createdDate: moment(),
        ratePointFrom,
        ratePointTo,
        startDate: moment(startDate).format(),
        dueDate: moment(endDate).format(),
        isPublish: true,
        isDelete: false,
        evaluationType: withScores ? 1 : 0,
        isPositiveFeedbacks: customNotesQuestion[0].checked,
        isNegativeFeedbacks: customNotesQuestion[1].checked,
        questions: questionsIdPost,
        evaluators: checkedIdOfEvaluator.map((item) => ({userId: item.evaluatorId})),
        evaluatees: checkedIdOfEvaluatee.map((item) => ({userId: item.evaluateeId})),
      }
      try {
        const response: any = await EventsApi.updateEvent(stateLocation.id, data)
        if (response.status === 200) {
          const scoringData = buttonsOfValue.map((item) => ({
            scoringValue: item.scoringValue,
            scoringName: item.scoringName,
            eventId: response.data.id,
          }))

          const newArrayEvalautorEvaluatees: {evaluatorId?: number; evaluateeId: number}[] = []

          checkedOfEvaluatee.forEach((item) => {
            newArrayEvalautorEvaluatees.push({
              evaluatorId: item.evaluatorId,
              evaluateeId: item.evaluateeId,
            })
          })

          const response2 = await ScoringsApi.updateScoring(stateLocation.id, {
            eventId: stateLocation.id,
            scoringArr: scoringData,
          })

          const response3 = await EventsApi.updateEventEvaluatorEvaluatees({
            eventId: stateLocation.id,
            evaluatorEvaluateeArr: newArrayEvalautorEvaluatees,
          })

          const response4 = await BonusesApi.updateBonus(stateLocation.id, {
            eventId: stateLocation.id,
            bonusArr: [
              ...rangesOfvalue.map((item) => ({
                eventId: stateLocation.id,
                bonusPercentage: item.bonusPercentage,
                bonusRangeFrom: item.bonusRangeFrom,
                bonusRangeTo: item.bonusRangeTo,
                bonusRangeName: item.bonusRangeName,
              })),
            ],
          })

          if (response2.status === 200 || response3.status === 200 || response4.status === 200) {
            setOpenModalSuccess(true)
            setStartDate('')
            setEndDate('')
            setEventEvaluatee([])
            setEventEvaluator([])
            setCheckedIdOfEvaluatee([])
            setCheckedIdOfEvaluator([])
            setEventTitle('')
          }
        } else {
          setOpenModalError(true)
          setErrorMessage(response.response.data.message)
        }
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    } else {
      setError(true)
    }
  }

  const handleNext = () => {
    setClickedNext(true)
    if (nextStep) {
      setError(false)
      const newCompleted = completed
      newCompleted[activeStep] = true
      setCompleted(newCompleted)
      setActiveStep(activeStep + 1)
    } else {
      setError(true)
    }
  }

  useEffect(() => {
    if (clickedNext) {
      if (!startDate && !endDate) {
        setErrorDate(true)
      } else {
        setErrorDate(false)
      }

      if (!eventTitle) {
        setErrorEventTitle(true)
      } else {
        setErrorEventTitle(false)
      }

      if (!eventEvaluator.length) {
        setErrorEvaluators(true)
      } else {
        setErrorEvaluators(false)
      }

      if (!eventEvaluatee.length) {
        setErrorEvaluatees(true)
      } else {
        setErrorEvaluatees(false)
      }
    }
  }, [startDate, clickedNext, endDate, eventTitle, eventEvaluator, eventEvaluatee])

  const handleBack = () => {
    setClickedNext(false)
    setErrorEvaluatees(false)
    setErrorEvaluators(false)
    setErrorEventTitle(false)
    setErrorDate(false)
    setNextStep(true)
    setError(false)
    const newCompleted = completed
    newCompleted[activeStep] = false
    setCompleted(newCompleted)
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleCloseSuccessModal = () => {
    setOpenModalSuccess(false)
    navigate('/events')
  }

  const handleCloseErrorModal = () => setOpenModalError(false)

  const handleWithScores = () => {
    setErrorDate(false)
    setErrorEventTitle(false)
    setErrorEvaluators(false)
    setErrorEvaluatees(false)
    setErrorCheckedOfEvaluatee(false)
    setClickedNext(false)
    setWithScores(true)
    setError(false)
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    setActiveStep(activeStep + 1)
  }

  const handleWithoutScores = () => {
    setErrorDate(false)
    setErrorEventTitle(false)
    setErrorEvaluators(false)
    setErrorEvaluatees(false)
    setErrorCheckedOfEvaluatee(false)
    setClickedNext(false)
    setWithScores(false)
    setError(false)
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    setActiveStep(activeStep + 1)
  }

  const renderBackButton = () => (
    <Box className={`${activeStep === 0 && classes.displayNone} mr-46`}>
      <ButtonTranparentBorder handleClick={handleBack} title="Back" width="width150" />
    </Box>
  )

  const renderSaveButton = () => {
    if (!clone && !view && !stateLocation.createNewEvent && activeStep + 1 === steps.length) {
      return <ButtonBlue handleClick={handleSave} title="SAVE" width="width150" size="large" />
    }
  }
  const renderPublishButton = () => (
    <ButtonBlue handleClick={completedSteps} title="Publish" width="width150" size="large" />
  )

  const renderNextButton = () => {
    if (isLoading || isQuestionsLoading) {
      return <CircularProgress />
    }
    return (
      <Box>
        {activeStep >= steps.length - 5 && activeStep !== steps.length - 1 && (
          <ButtonBlue handleClick={handleNext} width="width150" title="NEXT" />
        )}
      </Box>
    )
  }

  useEffect(() => {
    if (stateLocation.id) {
      const updatedRangesOfValue = rangesOfvalue.map((item) => ({
        ...item,
        bonusRangeTo: rangeMax,
        bonusRangeFrom: rangeMin,
      }))
      setRangesOfValue(updatedRangesOfValue)
    } else {
      const minCount = questions.reduce(
        (first, second) => first + Number(second.coefficient) * Number(ratePointFrom),
        0,
      )
      const maxCount = questions.reduce(
        (first, second) => first + Number(second.coefficient) * Number(ratePointTo),
        0,
      )
      setRangeMin(minCount.toString())
      setRangeMax(maxCount.toString())
      const updatedRangesOfValue = rangesOfvalue.map((item) => ({
        ...item,
        bonusRangeTo: maxCount.toString(),
        bonusRangeFrom: minCount.toString(),
      }))
      setRangesOfValue(updatedRangesOfValue)
    }
  }, [ratePointTo, ratePointFrom, questions, rangeMax, rangeMin])

  return (
    <Box className="create-event-page">
      <Box className="font-size-16 d-flex align-center">
        <Link
          className="text-decoration-none align-center color-black d-flex font-weight-400"
          to="/events"
        >
          <LeftIcon />
          <Box className="font-weight-700 ml-16 font-size-24 heading">New Event</Box>
        </Link>
      </Box>
      <Box className="mt-30 pb-20">
        <StepperPage
          steps={steps}
          completed={completed}
          activeStep={activeStep}
          stepperAllActive={false}
        />
        <Box className="mt-50">
          <Box>
            {stateLocation.createNewEvent && activeStep === 0 && (
              <Box className="select-scores-container align-center font-size-14 mt-40">
                <Box className={`${classes.marginRight20}`}>
                  <ButtonBlue
                    handleClick={handleWithScores}
                    width="width190"
                    padding="padding34"
                    title="Create event with scores"
                  />
                </Box>
                <Box className={`${classes.marginRight20}`}>
                  <ButtonBlue
                    handleClick={handleWithoutScores}
                    width="width190"
                    title="Create event without scores"
                    padding="padding34"
                  />
                </Box>
              </Box>
            )}
            {(stateLocation.createNewEvent ? activeStep === 1 : activeStep === 0) && (
              <Box className={`${classes.creatEventContainer}`}>
                <Box className="d-flex justify-center">
                  <Step1
                    afterStartEvent={afterStartEvent}
                    setNextStep={setNextStep}
                    error={error}
                    view={view}
                  />
                </Box>
              </Box>
            )}
            {(stateLocation.createNewEvent ? activeStep === 2 : activeStep === 1) && (
              <Box className={`${classes.creatEventContainer}`}>
                <Step2
                  clickedNext={clickedNext}
                  afterStartEvent={afterStartEvent}
                  error={error}
                  setNextStep={setNextStep}
                  getEvaluatorEvaluatee={getEvaluatorEvaluatee}
                  view={view}
                />
              </Box>
            )}
            {(stateLocation.createNewEvent ? activeStep === 3 : activeStep === 2) && (
              <Step3
                afterStartEvent={afterStartEvent}
                error={error}
                isQuestionsLoading={isQuestionsLoading}
                setIsQuestionsLoading={setIsQuestionsLoading}
                fullQuestions={fullQuestions}
                view={view}
                setNextStep={setNextStep}
              />
            )}
            {(stateLocation.createNewEvent ? activeStep === 4 : activeStep === 3) && (
              <Step4 setNextStep={setNextStep} error={error} view={view} />
            )}
            {(stateLocation.createNewEvent ? activeStep === 5 : activeStep === 4) && (
              <Step5 setNextStep={setNextStep} error={error} view={view} />
            )}
          </Box>
          <Box className="create-event-buttons justify-center mt-60">
            {renderBackButton()}
            {renderNextButton()}
            <Box>
              {!isLoading && renderSaveButton()}
              {!isLoading && clone && activeStep + 1 === steps.length && renderPublishButton()}
              {!isLoading &&
                !clone &&
                stateLocation.createNewEvent &&
                activeStep + 1 === steps.length &&
                renderPublishButton()}
            </Box>
          </Box>
        </Box>
      </Box>
      <SuccessModal openModal={openModalSuccess} closeModal={handleCloseSuccessModal} />
      <ErrorModal
        openModal={openModalError}
        errorMessage={errorMessage}
        closeModal={handleCloseErrorModal}
      />
    </Box>
  )
}

export default EventCreate
