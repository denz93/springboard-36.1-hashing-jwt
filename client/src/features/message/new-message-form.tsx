import { useAuth } from "../auth";
import { useUsersQuery } from "../user/queries";
import {useForm} from 'react-hook-form'
import { CreateMessageSchema } from "./schema";
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from 'zod';
import { useSendMessage } from "./queries";

const NewMessageForm = () => {
  const {data: users} = useUsersQuery()
  const {username: senderUsername} = useAuth()
  const {register, handleSubmit, formState: {errors}} = useForm<z.infer<typeof CreateMessageSchema>>({
    resolver: zodResolver(CreateMessageSchema)
  })
  const {mutate: sendMessage, isPending, error} = useSendMessage()
  return (
    <form className="flex justify-center" onSubmit={handleSubmit((data) => sendMessage(data))}>
      <div className="w-[500px] flex flex-col gap-2 items-center">
        {error && <p className="text-error">{error.message}</p>}
        <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Send to</span>
              <span className="label-text-alt">username</span>
            </div>
            {errors.to_username && <label className='label text-error'>{errors.to_username?.message}</label>}
            <select {...register('to_username')} className="select select-bordered" defaultValue={'none'}>
              <option disabled  value={'none'}>Pick one</option>
              {users?.filter(u => u.username !== senderUsername).map((user) => (
                <option key={user.username} value={user.username}>{user.username}</option>
              ))}
            </select>
        </label>

        <textarea {...register('body')} cols={30} rows={10} className="textarea textarea-bordered w-full" placeholder="Your message go here"></textarea>
        {errors.body && <label className='label text-error'>{errors.body?.message}</label>}
        <button 
          className="btn btn-primary" 
          disabled={isPending}
        >Send</button>
      </div>
    </form>
  );
};

export default NewMessageForm;