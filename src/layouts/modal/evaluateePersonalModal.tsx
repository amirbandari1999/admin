import {Box, Button, Modal, TextField} from '@mui/material'
import React, {useState} from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CircularProgress from '@mui/material/CircularProgress'
import {AxiosResponse} from 'axios'
import useStylesModal from '../../assets/makeStyles/modals/modals'
import {
  IEvaluationPersonalFormReport,
  IEvaluationPersonalModal,
  IEvaluationPersonalState,
  IEvaluationPersonalStateGroupItem,
} from '../../shared/types/modal/evaluationPersonalModal'
import useStylesButton from '../../assets/makeStyles/buttons/buttons'
import ReportsApi from '../../api/reports'

const EvaluateePersonalModal = ({
  openModal,
  closeModal,
  data,
  evaluateeId,
  eventId,
  eventTitle,
}: IEvaluationPersonalModal) => {
  const classes = useStylesModal()
  const classesButton = useStylesButton()
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [successfully, setSuccessfully] = useState<boolean>(false)
  const [evaluationPersonalState, setEvalautionPersonalState] = useState<
    IEvaluationPersonalState[]
  >([
    {
      groupId: 1,
      groupName: 'General information',
      groupItem: [
        {
          id: 1,
          key: 'EvaluateeFirstName',
          name: '1. FIRST NAME:',
          value: data?.EvaluateeFirstName ? data?.EvaluateeFirstName : '',
          isEdit: false,
        },
        {
          id: 2,
          key: 'EvaluateeLastName',
          name: '2. LAST NAME:',
          value: data?.EvaluateeLastName ? data?.EvaluateeLastName : '',
          isEdit: false,
        },
        {
          id: 3,
          key: 'EvaluateePosition',
          name: '3. JOB TITLE:',
          isEdit: false,
          value: data?.EvaluateePosition ? data?.EvaluateePosition : '',
        },
        {
          id: 4,
          key: 'Data4',
          name: '4. DEPARTMENT:',
          isEdit: false,
          value: data?.Data4 ? data?.Data4 : '',
        },
        {
          id: 5,
          key: 'Data5',
          name: '5. DIRECT REPORT (NAME, TITLE):',
          isEdit: false,
          value: data?.Data5 ? data?.Data5 : '',
        },
      ],
    },
    {
      groupId: 2,
      groupName: 'Performance assessment results',
      groupItem: [
        {
          id: 1,
          key: 'EventTitle',
          name: '6. PERFORMANCE ASSESSMENT PERIOD:',
          isEdit: false,
          value: data?.EventTitle ? data.EventTitle : '',
        },
        {
          id: 2,
          key: 'BonusRangeName',
          name: '7. EVALUATION RESULT:',
          isEdit: false,
          value: data?.BonusRangeName ? data.BonusRangeName : '',
        },
        {
          id: 3,
          key: 'BonusPercentage',
          name: '8. BONUS PERCENTAGE:',
          isEdit: false,
          value: data?.BonusPercentage,
        },
        {
          id: 4,
          key: 'AveragePoint',
          name: '9. SCORING AREAS/DIMENSIONS',
          isEdit: false,
          value: data?.AveragePoint,
        },
      ],
    },
    {
      groupId: 3,
      groupName: ' Development & Improvementaction plan',
      groupItem: [
        {
          id: 1,
          key: 'NegativeFeedbacks',
          name: '10. DIMENSIONS TO WORK ONDURING THE UPCOMING 6 MONTHS',
          isEdit: false,
          value: data?.NegativeFeedbacks ? data?.NegativeFeedbacks : '',
          textarea: true,
        },
        {
          id: 2,
          key: 'PositiveFeedbacks',
          name: '11. PRESCRIBED GOALS TO BE ACHIEVEDIN THE UPCOMING 6 MONTHS',
          isEdit: false,
          value: data?.PositiveFeedbacks ? data?.PositiveFeedbacks : '',
          textarea: true,
        },
        {
          id: 3,
          key: 'Data12',
          name: '12. RECOMMENDED TRAININGS /COURSES',
          isEdit: false,
          value: data?.Data12 ? data?.Data12 : '',
          textarea: true,
        },
      ],
    },
  ])

  const handleIsEdit = (
    group: IEvaluationPersonalState,
    groupItem: IEvaluationPersonalStateGroupItem,
  ) => {
    const updateFormControl = evaluationPersonalState.map((item) => {
      if (item.groupId === group.groupId) {
        return {
          ...item,
          groupItem: item.groupItem.map((item2) => {
            if (item2.id === groupItem.id) {
              return {...item2, isEdit: !item2.isEdit}
            }
            return item2
          }),
        }
      }
      return item
    })
    setEvalautionPersonalState(updateFormControl)
  }

  const handleChangeValue = (
    value: string,
    group: IEvaluationPersonalState,
    groupItem: IEvaluationPersonalStateGroupItem,
  ) => {
    const updateFormControl = evaluationPersonalState.map((item) => {
      if (item.groupId === group.groupId) {
        return {
          ...item,
          groupItem: item.groupItem.map((item2) => {
            if (item2.id === groupItem.id) {
              return {...item2, value}
            }
            return item2
          }),
        }
      }
      return item
    })
    setEvalautionPersonalState(updateFormControl)
  }

  const handleClick = async () => {
    setError(false)
    setSuccessfully(false)
    setSaveLoading(true)
    const formState = evaluationPersonalState
      .map((item) => [...item.groupItem.filter((item2) => item2)])
      .flat()

    const formStateFilter = formState.map((item) => [item.key, item.value])

    const response = await ReportsApi.saveEvaluationDataPersonalFormReport({
      eventId,
      evaluateeId,
      savedData: Object.assign(data, Object.fromEntries(formStateFilter)),
    })

    if (response.status === 200) {
      setError(false)
      setSuccessfully(true)
      setSaveLoading(false)
    } else {
      setError(true)
      setSuccessfully(false)
    }
  }

  const handleCloseModal = () => {
    setError(false)
    setSuccessfully(false)
    closeModal()
  }

  const handleExportAsPDF = async () => {
    const formState = evaluationPersonalState
      .map((item) => [...item.groupItem.filter((item2) => item2)])
      .flat()
    const formStateFilter = formState.map((item) => [item.key, item.value])
    const mergeObject = Object.assign(data, Object.fromEntries(formStateFilter))
    const mergeObjectEntries = Object.entries(mergeObject)
    const mergeObjectFilter = mergeObjectEntries.filter(([key, value]) => !!key && !!value)
    const resultObject = Object.fromEntries(mergeObjectFilter)

    await ReportsApi.createPDFReportForEachPerson({
      eventId,
      evaluateeId,
      savedData: resultObject as unknown as IEvaluationPersonalFormReport,
    }).then((response: AxiosResponse) => {
      const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'ReportForEachPerson.pdf')
      document.body.appendChild(link)
      link.click()
      setError(false)
      setSuccessfully(false)
    })
  }

  return (
    <Modal
      className={`${classes.styledModal}`}
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={openModal}
      onClose={() => handleCloseModal()}
      BackdropProps={{
        timeout: 200,
      }}
    >
      <Box className={classes.modalContainerEvaluatee}>
        <Box className="modal-success-container modal-evaluatee mt-26 text-center">
          <Box className="mt-40 pl-40 pr-40">
            <Box className="color-black font-weight-700">EMPLOYEE PERFORMANCE ASSESSMENT FORM</Box>
            <Box className="border-dark-blue mt-24" />
            <Box className="color-orange mt-10 mb-10">{eventTitle}</Box>
            <Box className="border-dark-blue" />
          </Box>

          {evaluationPersonalState.map((item, index) => (
            <Box key={index}>
              <Box className="mt-50">
                <Box className="right-arrow-container d-flex align-center">
                  <Box className="d-flex flex-column">
                    <Box className="arrow-left-top" />
                    <Box className="arrow-left-bottom" />
                  </Box>
                  <Box className="arrow-right-body d-flex align-center color-orange float-left font-weight-700">
                    {item.groupName}
                  </Box>
                  <Box className="arrow-right" />
                </Box>
              </Box>
              {item.groupItem.map((item2, index2) => (
                <Box key={index2} className="mt-10">
                  <Box className="d-flex flex-column">
                    <Box className="mt-20 text-field-container">
                      <Box className="color-dark-blue text-left">{item2.name}</Box>
                      <Box className="ml-10">
                        {!item2.isEdit ? (
                          <Box
                            className={`${
                              item2.textarea ? 'edit-textarea-container' : 'edit-container'
                            }`}
                            onClick={() => handleIsEdit(item, item2)}
                          >
                            {item2.value}
                          </Box>
                        ) : (
                          <Box className="d-flex align-center">
                            <TextField
                              value={item2.value}
                              onChange={(e) => handleChangeValue(e.target.value, item, item2)}
                              size="small"
                              fullWidth
                              multiline
                              rows={item2.textarea ? 5 : 1}
                            />
                            <Box className="ml-18">
                              <Button
                                className="width-20"
                                onClick={() => handleIsEdit(item, item2)}
                              >
                                <CheckCircleOutlineIcon />
                              </Button>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
          <Box className="pl-40 pr-40">
            <Box className="mt-50">
              Team chart of staff performance assessment results with mentioning the place of
              concrete employee in question there (keeping confidentiality of others data)
            </Box>
            <Box className="mt-50 color-dark-blue">
              SEMI-ANNUAL EMPLOYEE PERFORMANCE ASSESSMENT IS CONDUCTED FOR ALL EMPLOYEES OF PLAT.AI
              ACCORDING TO THE EMPLOYEE PERFORMANCE ASSESSMENT PROCEDURE.
            </Box>
            <Box className="mt-24">
              <Box className="border-dark-blue mt-24" />
              <Box className="color-orange mt-10 mb-10">CONFIRMATION</Box>
              <Box className="border-dark-blue" />
            </Box>
            <Box className="mt-24 d-flex flex-column">
              <Box className="mt-40">
                <Box>Employee Name, Last Name and Signature</Box>
                <TextField id="standard-basic" variant="standard" />
                <Box className="mt-20">Date</Box>
                <TextField id="standard-basic" variant="standard" />
              </Box>
              <Box className="mt-40">
                <Box>HR Name, Last Name and Signature</Box>
                <TextField id="standard-basic" variant="standard" />
                <Box className="mt-20">Date</Box>
                <TextField id="standard-basic" variant="standard" />
              </Box>
              <Box className="mt-40">
                <Box>HR Name, Last Name and Signature</Box>
                <TextField id="standard-basic" variant="standard" />
                <Box className="mt-20">Date</Box>
                <TextField id="standard-basic" variant="standard" />
              </Box>
            </Box>
          </Box>
        </Box>
        {error && (
          <Box className="m-auto color-red font-weight-600 font-size-18 text-center pb-20">
            Something went wrong
          </Box>
        )}
        {successfully && (
          <Box className="m-auto successfully text-center pb-20">
            Your changes have been successfully saved!
          </Box>
        )}
        {saveLoading ? (
          <Box className="mt-24 mb-24 d-flex justify-center">
            <CircularProgress />
          </Box>
        ) : (
          <Box className="mt-24 mb-24 d-flex flex-wrap justify-center">
            <Box className="mr-16 mb-22">
              <Button
                onClick={() => handleCloseModal()}
                className={`${classesButton.colorBlueButton} ${classesButton.width128}`}
              >
                Close
              </Button>
            </Box>
            <Box className="mr-16 mb-22">
              <Button
                onClick={() => handleClick()}
                className={`${classesButton.colorBlueButton} ${classesButton.width128}`}
              >
                Save
              </Button>
            </Box>
            <Box className="mb-22">
              <Button
                onClick={() => handleExportAsPDF()}
                className={`${classesButton.colorBlueButton} ${classesButton.width150}`}
              >
                Export as PDF
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Modal>
  )
}

export default EvaluateePersonalModal
