import {IQuestionGroupTitle} from '../../shared/types/events/events'
import QuestionApi from '../../api/question'

const criteriaUtils = async (item: IQuestionGroupTitle) => {
  const response = await QuestionApi.updateQuestionGroup(item)
  return response
}

export default criteriaUtils
