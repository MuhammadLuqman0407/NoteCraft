import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './pages/Home';
import Register from './auth/Signup.jsx';
import Login from './auth/Signin.jsx';
import Paste from './pages/Paste';
import ViewPaste from './pages/ViewPaste';
import NotFound from './pages/NotFound';
import Navbar from './pages/Navbar';
import Otp from './auth/Otp.jsx';
import Dashboard from './pages/Dashboard.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="min-h-screen flex flex-col bg-[var(--theme-bg)] text-[var(--text-primary)] transition-colors duration-200">
        {/* <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-12">
          <Home />
        </main> */}
        <Dashboard />
      </div>
    ),
  },
  {
    path: '/pastes',
    element: (
      <div className="min-h-screen flex flex-col bg-[var(--theme-bg)] text-[var(--text-primary)] transition-colors duration-200">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-12">
          <Paste />
        </main>
      </div>
    ),
  },
  {
    path: '/pastes/:id',
    element: (
      <div className="min-h-screen flex flex-col bg-[var(--theme-bg)] text-[var(--text-primary)] transition-colors duration-200">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-12">
          <ViewPaste />
        </main>
      </div>
    ),
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/verify-otp',
    element: <Otp />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
