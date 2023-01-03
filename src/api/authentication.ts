import axios from '../axios'

const logIn = async (value: {email: string; password: string}) => {
  const response = await axios.post('Authentication/login', value)
  return response
}

const logOut = async () => {
  const response = await axios.post('Authentication/logout')
  return response
}

const signUp = async (data: FormData) => {
  const response = await axios.post(`Authentication/signUp`, data)
  return response
}

const signUpConfirmation = async (userToken: string | null) => {
  const response = await axios.get(`Authentication/signupConfirmation/${userToken}`)
  return response
}

const forgotPassword = async (email: FormData) => {
  const response = await axios.post(`Authentication/forgotPassword`, email)
  return response
}

const forgotPasswordConfirmation = async (data: FormData) => {
  const response = await axios.post(`Authentication/forgotPasswordConfirmation`, data)
  return response
}

const changePassword = async (data: FormData) => {
  const response = await axios.post(`Authentication/changePassword`, data)
  return response
}

const AuthenticationsApi = {
  logIn,
  logOut,
  signUp,
  signUpConfirmation,
  forgotPassword,
  forgotPasswordConfirmation,
  changePassword,
}

export default AuthenticationsApi
