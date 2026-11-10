import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home'
import Paste from './pages/Paste'
import ViewPaste from './pages/ViewPaste'
import NotFound from './pages/NotFound'
import Navbar from './pages/Navbar'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element:
        <div>
          <Navbar />
          <Home />
        </div>
    },
    {
      path: '/pastes',
      element:
        <div>
          <Navbar />
          <Paste />
        </div>
    },
    {
      path: '/pastes/:id',
      element:
        <div>
          <Navbar />
          <ViewPaste />
        </div>
    },
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]
)

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
