import {Outlet, Link} from 'react-router-dom';
import { useAuth } from '../features/auth';

const Layout = () => {
  const hooks = useAuth();
  const {isAuthenticated, logout, username} = hooks;
  return (
    <>
      <header>
        <nav className='navbar'>
          <div className='flex-1 flex gap-4'>
            <Link to='/'>Messagely</Link>
            <span className='italic'>Hi @{username}</span>
          </div>

          <div className='flex-none'>
            <ul className='menu menu-horizontal px-1'>
              {!isAuthenticated && <>
                <li>
                  <Link to='/auth/login'>Login</Link>
                </li>
                <li>
                  <Link to='/auth/register'>Register</Link>
                </li>

                   
              </>}
              {isAuthenticated && <>
                <li><Link to='/messages'>Messages</Link></li>
                <li><Link to='/messages/new'>New Message</Link></li>
                <li>
                  <Link to='/auth/login'  onClick={() => logout()}>Log out</Link>
                </li> 
              </>}
            </ul>
          </div>
        </nav>
      </header>
      <main>
        <Outlet context={hooks}  />
      </main>
      <footer>
      </footer>
    </>
  );
};

export default Layout;