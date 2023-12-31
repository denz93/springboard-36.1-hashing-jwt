import MessageList from '../features/message/message-list';

const Messages = () => {
  return (
    <section>
      <h1 className='text-center text-4xl'>Messages</h1>
      <div className='w-96 max-w-full m-auto mt-8'>
        <MessageList/>  
      </div>
    </section>
  );
};

export default Messages;