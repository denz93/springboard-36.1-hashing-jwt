import {RouteObject, redirect} from 'react-router-dom'
import Layout from './layout'
import Register from './pages/Register'
import Login from './pages/Login'
import Messages from './pages/Messages'
import NewMessage from './pages/NewMessage'



const homePage: RouteObject = {
  element: <Messages/>,
  index: true
}
const newMessagePage: RouteObject = {
  path: '/messages/new',
  element: <NewMessage/>,
}
const messagesPage: RouteObject = {
  path: '/messages',
  element: <Messages/>,
}

export const registerPage: RouteObject = {
  path: 'register',
  element: <Register/>,
}

export const loginPage: RouteObject = {
  path: 'login',
  element: <Login/>,
}
export const authenticatedRoutes: RouteObject = {
  loader: () => {
    const isAuthenticated = !!localStorage.getItem('token')
    if (!isAuthenticated) {
      return redirect('/auth/login')
    }
    return null
  },
  
  children: [
    homePage,
    messagesPage,
    newMessagePage
  ]
}

export const authRoutes: RouteObject = {
  path: '/auth',
  loader: () => {
    const isAuthenticated = !!localStorage.getItem('token')
    if (isAuthenticated) {
      return redirect('/')
    }
    return null
  },
  children: [
    registerPage,
    loginPage
  ]
}

export const routeTree: RouteObject =  {
  element: <Layout/>,
  children: [
    authenticatedRoutes,
    authRoutes,
  ]
}
