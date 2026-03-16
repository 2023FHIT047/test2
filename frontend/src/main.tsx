import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import './index.css'
import './i18n'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'

// Set global axios base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.baseURL = `${API_BASE_URL}/api`;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
