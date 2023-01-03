import axios from '../axios'
import {IQuestionGroupTitle} from '../shared/types/events/events'

const getQuestionsGroups = async () => {
  const data = await axios.get('Question/getQuestionGroups')
  return data
}

const getQuestionGroup = async (id: number) => {
  const data = await axios.get(`Question/getQuestionGroup/${id}`)
  return data
}

const getTemplates = async () => {
  const response = await axios.get(`Question/getTemplates`)
  return response
}

// TODO: Finish this endpoint
const getQuestionsList = async () => {
  const data = await axios.get('Question/getQuestions')
  return data
}

// TODO: Finish this endpoint
const getQuestionsByAdminList = async (adminId: number) => {
  const data = await axios.get(`Question/getQuestionsByAdmin/${adminId}`)
  return data
}

// TODO: Finish this endpoint
const getQuestionList = async (id: number) => {
  const data = await axios.get(`Question/getQuestion/${id}`)
  return data
}

const createQuestionGroup = async (value: string) => {
  const response = await axios.post('Question/createQuestionGroup', {
    questionGroupTitle: value,
    isDelete: false,
    applyDefault: false,
  })
  return response
}

const updateQuestionGroup = async (data: IQuestionGroupTitle) => {
  const response = await axios.put(`Question/updateQuestionGroup/${data.id}`, {
    questionGroupTitle: data.questionGroupTitle,
    isDelete: false,
    applyDefault: data.applyDefault,
  })
  return response
}

const createQuestion = async (
  questionTitle: string,
  description: string,
  questionGroupId: number,
  isDelete: boolean,
) => {
  const response = await axios.post('Question/createQuestion', {
    questionTitle,
    questionDescription: description,
    questionGroupId,
    isDelete,
    coefficient: 1,
  })
  return response
}

const updateQuestion = async ({
  id,
  questionTitle,
  questionDescription,
  rating,
  questionId,
  applyQuestionDescription,
}: {
  id: number
  questionTitle: string
  questionDescription: string
  rating: string
  questionId: number
  applyQuestionDescription?: boolean
}) => {
  await axios.put(`Question/updateQuestion/${id}`, {
    questionTitle,
    coefficient: rating,
    isDelete: false,
    questionDescription,
    ...(applyQuestionDescription && {
      applyQuestionDescription,
    }),
    questionGroupId: questionId,
  })
}

// TODO: Finish this endpoint
const deleteQuestion = async (id: number) => {
  await axios.delete(`Question/deleteQuestion/${id}`)
}

const deleteQuestionGroup = async (id: number) => {
  await axios.delete(`Question/deleteQuestionGroup/${id}`)
}

const QuestionApi = {
  getQuestionsGroups,
  getQuestionGroup,
  getQuestionsList,
  getQuestionsByAdminList,
  getQuestionList,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createQuestionGroup,
  updateQuestionGroup,
  deleteQuestionGroup,
  getTemplates,
}

export default QuestionApi
