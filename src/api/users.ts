import axios from '../axios'

const usersList = async () => {
  const data = await axios.get('User/getUsers')
  return data
}

const userList = async (id: number | null) => {
  const data = await axios.get(`User/getUser/${id}`)
  return data
}

const createUser = async (data: FormData) => {
  const response = await axios.post(`User/createUser`, data)
  return response
}

const updateUser = async (id: number, data: FormData) => {
  const response = await axios.put(`User/updateUser/${id}`, data)
  return response
}

const getUsersPagination = async (page: number, pageSize: number) => {
  const response = await axios.get(`User/getUsers/${page}/${pageSize}`)
  return response
}

const deleteUser = async (id: string | number) => {
  const response = await axios.delete(`User/deleteUser/${id}`)
  return response
}

const getAccounts = async () => {
  const response = await axios.get(`User/getAccounts`)
  return response
}

const updateMyProfile = async (data: FormData) => {
  const response = await axios.put(`User/updateMyProfile`, data)
  return response
}

const switchActiveAccount = async (id: number | string) => {
  const response = await axios.put(`User/switchActiveAccount/${id}`)
  return response
}

const getSuperAdminUser = async (id: number | string) => {
  const response = await axios.get(`User/getSuperAdminUser/${id}`)
  return response
}

const insertUsersFromCsv = async (data: FormData) => {
  const response = await axios.post(`User/insertUsersFromCsv`, data)
  return response
}

const UsersApi = {
  usersList,
  userList,
  createUser,
  updateUser,
  deleteUser,
  getUsersPagination,
  getAccounts,
  updateMyProfile,
  switchActiveAccount,
  getSuperAdminUser,
  insertUsersFromCsv,
}

export default UsersApi
