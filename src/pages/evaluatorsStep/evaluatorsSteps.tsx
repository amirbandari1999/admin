import React, {useEffect} from 'react'
import {Box, TextField} from '@mui/material'
import SelectButton from '../../layouts/selectButton'
import {IQuestion} from '../../interfaces/evaulateEvent'
import SelectButtonWithText from '../../layouts/selectButtonWithText'
import MakeStyles from '../../assets/makeStyles/makeStyles'
import {UseEvaluationContext} from '../../context/evalaution/evaluationContext'
import {IEvalautionProps} from '../../context/evalaution/evaluationContext.props'

const EvaluatorsSteps = ({
  setBlockedNext,
  ratePointFrom,
  ratePointTo,
  questionAnswers,
  markWithText,
  questions,
  setQuestionAnswers,
  setFeedbackOfQuestion,
  title,
}: {
  setBlockedNext: (value: boolean) => void
  ratePointFrom: number
  ratePointTo: number
  questionAnswers: {[k: number]: number}
  markWithText: boolean
  questions: IQuestion[]
  setQuestionAnswers: (questionId: number, questionValue: number) => void
  setFeedbackOfQuestion: (questionId: number, feedbackValue: string) => void
  title: string
}) => {
  const classes = MakeStyles()
  const {scorings} = UseEvaluationContext() as IEvalautionProps

  useEffect(() => {
    const filterQuestionAnswers = Object.entries(questionAnswers).filter((item) =>
      questions.find((item2) => Number(item[0]) === Number(item2.id)),
    )
    const findUnselectedQuestions = filterQuestionAnswers.find((item) => !item[1])

    if (findUnselectedQuestions) {
      setBlockedNext(true)
    } else {
      setBlockedNext(false)
    }
  }, [questionAnswers])

  return (
    <Box>
      <Box className="evaluators-step-rating-heading">
        <Box className="font-weight-600 font-size-16 color-dark-blue">{title}</Box>
        {/*<Box className="mt-12 font-weight-300 font-size-13 line-height-14  color-dark-blue">*/}
        {/*  Read the filters and add the rating for the evaluatee*/}
        {/*</Box>*/}
      </Box>
      <Box className="evaluators-step-rating-body">
        {questions.map((questionsData) => (
          <Box className="mt-52 width-100" key={questionsData.id}>
            <Box className="font-weight-700 color-dark-blue font-size-16 line-height-22">
              {questionsData.questionTitle}
            </Box>
            <Box className="font-weight-500 color-dark-blue font-size-16 mt-10 line-height-22">
              {questionsData.questionDescription}
            </Box>
            <Box className="question-container">
              <Box>
                <Box className="mt-14">
                  {markWithText ? (
                    <SelectButtonWithText
                      scorings={scorings}
                      disabled={false}
                      point={questionAnswers[questionsData.id]}
                      onChange={(rating) => setQuestionAnswers(questionsData.id, rating)}
                    />
                  ) : (
                    <SelectButton
                      disabled={false}
                      point={questionAnswers[questionsData.id]}
                      onChange={(rating) => setQuestionAnswers(questionsData.id, rating)}
                      ratePointFrom={ratePointFrom}
                      ratePointTo={ratePointTo}
                    />
                  )}
                </Box>
                {!markWithText && (
                  <Box className="mt-10 mb-10 font-size-13 color-light-gray2 font-weight-400 line-height-12 align-center d-flex justify-between">
                    <Box>Not at all</Box>
                    <Box className="ml-10 ">Excellent</Box>
                  </Box>
                )}
              </Box>
            </Box>
            {questionsData.applyQuestionDescription && (
              <Box className="question-feedback mt-20 width-100">
                <Box className="mb-10 font-weight-400 font-size-16">Add Feedback</Box>
                <TextField
                  id="standard-multiline-flexible"
                  multiline
                  maxRows={4}
                  fullWidth
                  onChange={(e) => setFeedbackOfQuestion(questionsData.id, e.target.value)}
                  className={`${classes.textFieldFeedback}`}
                  label="Feedback"
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default EvaluatorsSteps
