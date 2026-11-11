import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './store.js'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3500,
              style: {
                background: 'var(--card-bg)',
                color: 'var(--text-primary)',
                border: '1px solid var(--card-border)',
                borderRadius: '0.75rem',
                boxShadow: 'var(--card-shadow)',
                fontSize: '0.875rem',
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
