import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {config} from '../query.config';
import {CreateMessageSchema, MessageSchema} from './schema';
import {z} from 'zod';
import {useNavigate} from 'react-router-dom';

const {HOST_URL} = config;

async function fetchMessagesFrom(username: string) {
  const res = await axios.get(HOST_URL + `/users/${username}/from`);

  return res.data.messages as z.infer<typeof MessageSchema>[];
}
async function fetchMessagesTo(username:string) {
  const res = await axios.get(HOST_URL + `/users/${username}/to`);
  return res.data.messages as z.infer<typeof MessageSchema>[]
}
export function useMessagesQuery(username: string | null) {
  const query = useQuery({
    queryKey: ['messages', username],
    queryFn: async () => username ? (await Promise.all([
      fetchMessagesFrom(username),
      fetchMessagesTo(username)
    ])) : [],
    select(data) {
      return data.flat().map(m => {
        try {
          const parsedData = MessageSchema.parse(m)
          return parsedData
        } catch (err) {
          console.error(err)
        }
        return m
      })
    }
  })


  return query
}

async function mutateNewMessage(message: z.infer<typeof CreateMessageSchema>) {
  const res = await axios.post(HOST_URL + '/messages', message)
  return res.data.message as z.infer<typeof MessageSchema>
}


export function useSendMessage() {
  const query = useQueryClient() 
  const navigate = useNavigate()
  return useMutation({
    mutationFn: mutateNewMessage,
    onSuccess: () => {
      query.invalidateQueries({queryKey: ['messages']})
      navigate('/messages')
    },
    
  })
}

async function readMessage(messageId: number) {
  const res = await axios.post(HOST_URL + `/messages/${messageId}/read`)
  return res.data.message as z.infer<typeof MessageSchema>
}
export function useReadMessage() {
  const query = useQueryClient()
  return useMutation({
    mutationFn: (messageId: number) => readMessage(messageId),
    onSuccess: () => {
      query.invalidateQueries({queryKey: ['messages']})
    }
  })
}