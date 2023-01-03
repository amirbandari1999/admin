import axios from '../axios'
import {IReportEvaluationPairs, IReportsFilter} from '../shared/types/reports/reports'
import {IEvaluationPersonalFormReport} from '../shared/types/modal/evaluationPersonalModal'

const evaluationPointSumReportList = async ({
  page,
  pageSize,
  userId,
  eventId,
  evaluatorId,
  evaluateeId,
  startDate,
  endDate,
  evaluationType,
}: IReportsFilter) => {
  const data = await axios.post(
    'Report/evaluationPointSumReport',
    {
      page,
      pageSize,
      adminId: userId,
      eventId,
      evaluationType,
      evaluatorId,
      evaluateeId,
      startDate,
      endDate,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return data
}

const createCertificate = async ({
  userId,
  totalScore,
  certificateType,
}: {
  userId: number | undefined
  totalScore: string | undefined
  certificateType: number
}) => {
  const data = await axios.get(
    `Report/createCertificate/${userId}/${totalScore}/${certificateType}`,
    {
      responseType: 'blob',
    },
  )
  return data
}

const createReportEvaluationPairs = async (data: IReportEvaluationPairs) => {
  const response = await axios.post(`Report/createReportEvaluationPairs`, data, {
    responseType: 'blob',
  })
  return response
}

const createReportEvaluationAbsolute = async (data: IReportEvaluationPairs) => {
  const response = await axios.post(`Report/createReportEvaluationAbsolute`, data, {
    responseType: 'blob',
  })
  return response
}

const createManualCertificate = async ({
  userName,
  totalScore,
  createDate,
  certificateType,
}: {
  userName: string | undefined
  totalScore: string | undefined
  createDate: string
  certificateType: number
}) => {
  const data = await axios.get(
    `Report/createManualCertificate/${userName}/${totalScore}/${createDate}/${certificateType}`,
    {
      responseType: 'blob',
    },
  )
  return data
}

const evaluationAbsolutePointReportList = async ({
  page,
  pageSize,
  userId,
  eventId,
  questionId,
  evaluationType,
  evaluatorId,
  evaluateeId,
  startDate,
  endDate,
}: IReportsFilter) => {
  const data = await axios.post(
    'Report/evaluationAbsolutePointReport',
    {
      page,
      pageSize,
      adminId: userId,
      eventId,
      questionId,
      evaluatorId,
      evaluateeId,
      evaluationType,
      startDate,
      endDate,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return data
}

const getEvaluationPersonalFormReport = async ({
  eventId,
  evaluateeId,
}: {
  eventId: number
  evaluateeId: number
}) => {
  const response = await axios.post('Report/getEvaluationPersonalFormReport', {
    eventId,
    evaluateeId,
  })
  return response
}

const createPdfReportEvaluationByQuestion = async ({
  eventId,
  evaluateeId,
}: {
  eventId: number
  evaluateeId: number
}) => {
  const response = await axios.post(
    'Report/createPdfReportEvaluationBuQuestion',
    {
      eventId,
      evaluateeId,
    },
    {
      responseType: 'blob',
    },
  )
  return response
}

const saveEvaluationDataPersonalFormReport = async ({
  eventId,
  evaluateeId,
  savedData,
}: {
  eventId: number | undefined
  evaluateeId: number | undefined
  savedData: IEvaluationPersonalFormReport
}) => {
  const response = await axios.post('Report/saveEvaluationDataPersonalFormReport', {
    eventId,
    evaluateeId,
    savedData: JSON.stringify(savedData),
  })
  return response
}

const createPDFReportForEachPerson = async ({
  eventId,
  evaluateeId,
  savedData,
}: {
  eventId: number | undefined
  evaluateeId: number | undefined
  savedData: IEvaluationPersonalFormReport
}) => {
  const response = await axios.post(
    'Report/createPdfReportForEachPerson',
    {
      eventId,
      evaluateeId,
      savedData: JSON.stringify(savedData),
    },
    {
      responseType: 'blob',
    },
  )
  return response
}

const ReportsApi = {
  evaluationPointSumReportList,
  evaluationAbsolutePointReportList,
  createCertificate,
  createManualCertificate,
  createReportEvaluationPairs,
  createReportEvaluationAbsolute,
  getEvaluationPersonalFormReport,
  saveEvaluationDataPersonalFormReport,
  createPDFReportForEachPerson,
  createPdfReportEvaluationByQuestion,
}

export default ReportsApi
