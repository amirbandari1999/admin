export type TypeLocationState = {
  id: number
  adminId: number
  ratePointFrom: number
  ratePointTo: number
  eventPairModelOut: {
    evaluatees: {
      firstName: string
      lastName: string
      position: string
      id: number
    }
    evaluators: {
      firstName: string
      lastName: string
      position: string
      id: number
    }
  }[]
}

export type LocationStateEditUser = {
  id: number
}
