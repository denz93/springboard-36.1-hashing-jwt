import React from 'react'
import ReactDOM from 'react-dom/client'
import {AppRouterProvider} from './router'
import './input.css'
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>

      <AppRouterProvider></AppRouterProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
