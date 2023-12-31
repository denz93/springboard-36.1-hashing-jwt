import axios from 'axios'
import {config } from '../query.config'
import {UserSchema} from './schema'
import {z} from 'zod'
import {useQuery} from '@tanstack/react-query'

const {HOST_URL} = config
async function fetchUsers() {
  const res = await axios.get(HOST_URL + '/users');
  return res.data.users as z.infer<typeof UserSchema>[]
}

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  })
}