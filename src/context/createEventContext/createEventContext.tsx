import React, {createContext, useContext, useState} from 'react'
import {
  IQuestionGroupTitle,
  IQuestions,
  IQuestionsId,
  IUsersOfEvaluator,
} from '../../shared/types/events/events'
import {IContextProps, ICreateEventProps} from './createEventContext.props'
import {INameOfUsers} from '../../shared/types'

const CreateEventContext = createContext<ICreateEventProps | null>(null)

const CreateEventPageProvider = ({children}: IContextProps) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [eventTitle, setEventTitle] = useState('')
  const [ratePointFrom, setRatePointFrom] = useState<string>('1')
  const [ratePointTo, setRatePointTo] = useState<string>('10')
  const [rangeMin, setRangeMin] = useState('')
  const [rangeMax, setRangeMax] = useState('')
  const [eventEvaluatee, setEventEvaluatee] = useState<IUsersOfEvaluator[]>([])
  const [eventEvaluator, setEventEvaluator] = useState<IUsersOfEvaluator[]>([])
  const [questions, setQuestions] = useState<IQuestions[]>([])
  const [questionsId, setQuestionsId] = useState<IQuestionsId[]>([])
  const [bonusPercentage, setBonusPercentage] = useState<number | undefined | null>()
  const [checkedIdOfEvaluator, setCheckedIdOfEvaluator] = useState<{evaluatorId: number}[]>([])
  const [checkedIdOfEvaluatee, setCheckedIdOfEvaluatee] = useState<{evaluateeId: number}[]>([])
  const [deletedSubQuestions, setDeletedSubQuestions] = useState<IQuestions[]>([])
  const [errorDate, setErrorDate] = useState<boolean>(false)
  const [errorEventTitle, setErrorEventTitle] = useState<boolean>(false)

  const [checkedItemOfEvaluatee, setCheckedItemOfEvaluatee] = useState<
    {evaluatorId?: number; evaluateeId: number; userName: string}[]
  >([])
  const [nameOfUsers, setNameOfUsers] = useState<INameOfUsers[]>([])
  const [checkedItemOfEvaluator, setCheckedItemOfEvaluator] = useState<
    {id: number; userName: string; eventId?: number}[]
  >([])
  const [withScores, setWithScores] = useState<boolean>(true)
  const [customNotesQuestion, setCustomNotesQuestion] = useState([
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
  const [checkedOfEvaluatee, setCheckedOfEvaluatee] = useState<
    {evaluatorId?: number; evaluateeId: number; userName: string}[]
  >([])
  const [buttonsOfValue, setButtonsOfValue] = useState<
    {
      id: string
      scoringName: string
      edit: boolean
      scoringValue: string
    }[]
  >([])

  const [rangesOfvalue, setRangesOfValue] = useState<
    {
      id: string
      bonusRangeFrom: string
      bonusRangeTo: string
      bonusPercentage: string
      bonusRangeName: string
    }[]
  >([])
  const [questionGroupTitleIsDefault, setQuestionGroupTitleIsDefault] = useState<
    IQuestionGroupTitle[]
  >([])
  const [questionGroupTitle, setQuestionGroupTitle] = useState<IQuestionGroupTitle[]>([])

  const [errorEvaluators, setErrorEvaluators] = useState<boolean>(false)
  const [errorEvaluatees, setErrorEvaluatees] = useState<boolean>(false)
  const [errorCheckedOfEvaluatee, setErrorCheckedOfEvaluatee] = useState<boolean>(false)

  const contextValues = React.useMemo(
    () => ({
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      eventTitle,
      setEventTitle,
      ratePointFrom,
      ratePointTo,
      setRatePointFrom,
      setRatePointTo,
      eventEvaluatee,
      setEventEvaluatee,
      buttonsOfValue,
      setButtonsOfValue,
      rangesOfvalue,
      setRangesOfValue,
      eventEvaluator,
      setEventEvaluator,
      questions,
      setQuestions,
      setNameOfUsers,
      nameOfUsers,
      setCheckedIdOfEvaluator,
      setCheckedIdOfEvaluatee,
      checkedIdOfEvaluator,
      checkedIdOfEvaluatee,
      setQuestionsId,
      questionsId,
      checkedItemOfEvaluatee,
      customNotesQuestion,
      setCustomNotesQuestion,
      setCheckedItemOfEvaluatee,
      checkedItemOfEvaluator,
      setCheckedItemOfEvaluator,
      setBonusPercentage,
      deletedSubQuestions,
      setDeletedSubQuestions,
      bonusPercentage,
      withScores,
      setWithScores,
      checkedOfEvaluatee,
      setCheckedOfEvaluatee,
      questionGroupTitleIsDefault,
      setQuestionGroupTitleIsDefault,
      questionGroupTitle,
      setQuestionGroupTitle,
      rangeMin,
      setRangeMin,
      rangeMax,
      setRangeMax,
      setErrorDate,
      errorDate,
      errorEventTitle,
      setErrorEventTitle,
      errorEvaluators,
      setErrorEvaluators,
      errorEvaluatees,
      setErrorEvaluatees,
      errorCheckedOfEvaluatee,
      setErrorCheckedOfEvaluatee,
    }),
    [
      checkedOfEvaluatee,
      startDate,
      endDate,
      nameOfUsers,
      eventTitle,
      rangesOfvalue,
      checkedItemOfEvaluator,
      customNotesQuestion,
      checkedItemOfEvaluatee,
      ratePointFrom,
      ratePointTo,
      buttonsOfValue,
      eventEvaluatee,
      eventEvaluator,
      questions,
      withScores,
      questionsId,
      deletedSubQuestions,
      questionGroupTitleIsDefault,
      questionGroupTitle,
      rangeMin,
      rangeMax,
      errorDate,
      errorEventTitle,
      errorEvaluatees,
      errorEvaluators,
      errorCheckedOfEvaluatee,
    ],
  )

  return <CreateEventContext.Provider value={contextValues}>{children}</CreateEventContext.Provider>
}

export default CreateEventPageProvider
export const UseCreateEventContext = () => useContext(CreateEventContext)
