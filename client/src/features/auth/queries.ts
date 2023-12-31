import {useMutation, useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import {  useAuthFromOutlet } from '.'
import { UserSchema } from '../user/schema'
import {z} from 'zod'
import {config} from '../query.config'
import { useNavigate, useSearchParams } from 'react-router-dom'
export type CreateUserInput = z.infer<typeof UserSchema>
const { HOST_URL } = config;

async function requestLogin(username:string, password:string) {
  const res = await axios.post(HOST_URL+'/auth/login', {username, password})
  if (res.status === 200) {
    return res.data.token as string
  } else {
    return null
  }
}

async function register(createUserInput: CreateUserInput) {
  const res = await axios.post(HOST_URL+'/auth/register', createUserInput)
  if (res.status === 200) {
    return res.data.token as string
  } else {
    return null
  }
}
export const useLoginQuery = () => {
  const {login} = useAuthFromOutlet()
  const [searchParams] = useSearchParams(new URLSearchParams([['redirect', '/']]))
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (
      {username, password}: {username:string, password:string}
      ) => requestLogin(username, password),
    onSuccess: (token) => {
      if (token) {
        console.log({token})
        login(token)
        navigate( searchParams.get('redirect') ?? '/messages', {replace: true})

      }
    },
    
  })
}

export const useRegisterQuery = () => {
  const {storeToken} = useAuthFromOutlet()
  const query = useQueryClient()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams(new URLSearchParams([['redirect', '/']]))

  return useMutation({
    mutationFn: (
      createUserInput: CreateUserInput
      ) => register(createUserInput),
    onSuccess: (token) => {
      if (token) {
        storeToken(token)
        query.invalidateQueries({queryKey: ['users']})
        navigate( searchParams.get('redirect') ?? '/messages', {replace: true})
      }
    }
  })
}