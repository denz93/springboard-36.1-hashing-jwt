import {routeTree} from './routes'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
const router = createBrowserRouter([routeTree])

export const AppRouterProvider = () => {
  return <RouterProvider router={router} />
}
