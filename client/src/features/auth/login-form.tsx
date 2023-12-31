import {Link} from 'react-router-dom';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import { LoginSchema } from './schema';
import {useForm} from 'react-hook-form';
import { useLoginQuery } from './queries';

const LoginForm = () => {
  const {handleSubmit, formState: {errors}, register} = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  })
  const {mutate, isError, isPending} = useLoginQuery()
  const onSubmit = handleSubmit((data) => mutate(data))
  return (
    <form className="flex justify-center" onSubmit={onSubmit}>
      <div className='w-[500px]'>
        {isError && <p className="text-error">Invalid username or password</p>}
        <div className="form-control mb-3">
          <label htmlFor="username" className='label'>Username</label>
          {errors.username && <label className='label text-error'>{errors.username?.message}</label>}
          <input {...register('username')} autoComplete='username' type="text" name="username" id="username" className="input input-bordered w-full"/>
        </div>
        <div className="form-control mb-3">
          <label htmlFor="password" className='label'>Password</label>
          { errors.password && <label className='label text-error'>{errors.password?.message}</label>}
          <input {...register('password')} autoComplete='current-password' type="password" name="password" id="password" className="input input-bordered w-full"/>
        </div>
        <button type="submit" className="btn btn-success mb-3 w-full" disabled={isPending}>Login</button>
        <Link to='/auth/register' className='btn btn-ghost w-full'>Register?</Link>
      </div>
    </form>
  );
};

export default LoginForm;