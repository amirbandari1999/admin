import React, {Dispatch} from 'react'
import {IEnhancedPerformanceReportTableRows} from '../table/table'

export interface IModalDelete {
  handleDelete: () => void
  openModal: boolean
  closeModal: () => void
  isLoading: boolean
  error: boolean
}

export interface IModal {
  openModal: boolean
  closeModal: () => void
  openCertificates?: () => void
  errorMessage?: string
  isLoading?: boolean
  error?: boolean
  data?: IEnhancedPerformanceReportTableRows
}

export interface IModalUsers {
  openModal: boolean
  closeModal: () => void
  handleSaveDetailsProps: (
    name: string,
    lastName: string,
    currency: number,
    email: string,
    position: string,
    monthlySalary: string,
    selectedImage: Blob | MediaSource | string,
    hireDate: string | null,
    isActive: boolean,
  ) => void
  successModal: boolean
  setSuccessModal: Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  error: boolean
  errorMessage: string
}
