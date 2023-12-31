import { useAuth } from "../auth";
import { useMessagesQuery, useReadMessage } from "./queries";
import dayjs from 'dayjs'
import RelativeTimePugin from 'dayjs/plugin/relativeTime'
import { useState } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MessageSchema } from "./schema";
import {z} from 'zod';

dayjs.extend(RelativeTimePugin)

const MessageList = () => {
  const {username} = useAuth()
  const {data: messages, isPending, isSuccess} = useMessagesQuery(username)
  const [message, viewMessage] = useState<z.infer<typeof MessageSchema> | null>(null)
  const {mutate: readMessage} = useReadMessage()
  if (isPending) 
    return <div className="flex flex-col items-center gap-4 mt-4">
      <div className="skeleton h-16 w-80 max-w-full"></div>
      <div className="skeleton h-16 w-80 max-w-full"></div>
      <div className="skeleton h-16 w-80 max-w-full"></div>
    </div>
  return (
    <ul className={`list-none flex flex-col gap-2`}>
      <dialog id='message-detail-modal' className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{message?.from_user ? 'FROM' : 'TO'} @{message ? message.from_user?.username || message.to_user?.username : ''}</h3>
          <p className="py-4">{message?.body}</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        </dialog>
      {isSuccess && messages.length === 0 && <div className="text-center italic opacity-50">No message</div>}
      {isSuccess && messages.map(({id, from_user, to_user, body, sent_at, read_at}) => (
        <li key={id} className={`cursor-pointer ${read_at ? 'grayscale-[.4]' : ''}`} onClick={() => {
          (document.getElementById('message-detail-modal') as HTMLDialogElement)?.showModal()
          viewMessage({id, from_user, to_user, body, sent_at, read_at})
          if (from_user && !read_at) {
            readMessage(id)
          }
        }}>
          <div className="flex bg-base-200 rounded-xl relative items-center h-24">
            <div className="w-max h-full rounded-l-xl flex flex-col justify-center items-center bg-base-300 p-2">
              {from_user && <>
                <div>FROM</div>
                <div className="text-right text-xs">@{from_user.username}</div>
              </>}
              {to_user && <>
                <div>TO</div>

                <div className="text-right text-xs">@{to_user.username}</div>
              </>}
            </div>
            <div className="m-2 line-clamp-2 basis-44 flex-grow">{body}</div>
            <div className="basis-32 flex-grow place-items-center justify-self-end flex justify-center flex-col">
              <div className="text-xs italic opacity-50 ">{dayjs(sent_at).fromNow()}</div>
              {read_at &&<div className="text-sm italic opacity-50 flex items-center"><IoCheckmarkDoneSharp/> read</div>}

            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MessageList;