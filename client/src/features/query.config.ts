import axios from 'axios'

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (!token || token === '') return config;
  config.headers.Authorization = `Bearer ${token}`
  return config
})

export const config = {
  HOST_URL: 'http://localhost:3000'
}