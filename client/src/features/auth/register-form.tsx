import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserSchema } from './schema';
import { z } from 'zod';
import { useRegisterQuery } from './queries';

const RegisterForm = () => {
  const {register, handleSubmit, formState: {errors}} = useForm<z.infer<typeof CreateUserSchema>>({
    resolver: zodResolver(CreateUserSchema),
  })
  const { mutate, isError, isPending } = useRegisterQuery()
  return (
    <form className='flex justify-center' onSubmit={handleSubmit((data) => mutate(data))}>
      <div className='w-[500px]'>
        {isError && <p className='text-error'>Something wrong</p>}
        <div className='form-control mb-3'>
          <label htmlFor="username" className='label'>Username</label>
          {errors.username && <label className='label text-error'>{errors.username?.message}</label>}
          <input {...register('username')} type="text" name="username" id="username" className="input input-bordered w-full"/>
        </div>
        <div className='form-control mb-3'>
          <label htmlFor="password" className='label'>Password</label>
          { errors.password && <label className='label text-error'>{errors.password?.message}</label>}
          <input {...register('password')} type="password" name="password" id="password" className="input input-bordered w-full"/>
        </div>
        <div className='form-control mb-3'>
          <label htmlFor="repassword" className='label'>Re-Password</label>
          { errors.repassword && <label className='label text-error'>{errors.repassword?.message}</label>}
          <input {...register('repassword')} type="password" name="repassword" id="repassword" className="input input-bordered w-full"/>
        </div>
        <div className='form-control mb-3'>
          <label htmlFor="first_name" className="label">First name</label>
          {errors.first_name && <label className='label text-error'>{errors.first_name?.message}</label>}
          <input {...register('first_name')} type="text" name="first_name" id="first_name" className="input input-bordered w-full"/>
        </div>
        <div className='form-control mb-3'>
          <label htmlFor="last_name" className="label">Last name</label>
          {errors.last_name && <label className='label text-error'>{errors.last_name?.message}</label>}
          <input {...register('last_name')} type="text" name="last_name" id="last_name" className="input input-bordered w-full"/>
        </div>
        <div className='form-control mb-3'>
          <label htmlFor="phone" className="label">Phone</label>
          {errors.phone && <label className='label text-error'>{errors.phone?.message}</label>}
          <input {...register('phone')} type="text" name="phone" id="phone" className="input input-bordered w-full"/>
        </div>
        <button type="submit" className="btn btn-success mb-3 w-full" disabled={isPending}>Register</button>
      </div>
    </form>
  );
};

export default RegisterForm;