export interface IEvaluationPersonalFormReport {
  AveragePoint: number
  BonusAmount: number
  BonusPercentage: number
  BonusRangeFrom: number
  BonusRangeName: null | string
  BonusRangeTo: number
  Currency: number
  DueDate: string
  Data4: string
  Data5: string
  Data12: string
  EvaluateeFirstName: string
  EvaluateeId: number
  EvaluateeLastName: string
  EvaluateeName: string
  EvaluateePosition: string
  PositiveFeedbacks: string
  NegativeFeedbacks: string
  EvaluatorCount: number
  EventId: number
  EventTitle: string
  HireDate: null | string
  Id: number
  MonthlySalary: number
  QuestionCount: number
  StartDate: string
  SumCoefficient: number
  SumPoint: number
}

export interface IEvaluationPersonalModal {
  openModal: boolean
  closeModal: () => void
  eventId: number
  evaluateeId: number
  data: IEvaluationPersonalFormReport | undefined
  eventTitle: string
}

export interface IEvaluationPersonalStateGroupItem {
  id: number
  key: string
  name: string
  value: string | number | undefined
  isEdit: boolean
  textarea?: boolean
}

export interface IEvaluationPersonalState {
  groupId: number
  groupName: string
  groupItem: IEvaluationPersonalStateGroupItem[]
}
