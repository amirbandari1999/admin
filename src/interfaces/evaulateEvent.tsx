export interface IQuestion {
  applyQuestionDescription: boolean
  adminId: number
  id: number
  isDelete: boolean
  questionGroupId: number
  questionTitle: string
  questionDescription: string
}
export interface QuestionGroup {
  id: number
  isDelete: boolean
  questionGroupTitle: string
}
