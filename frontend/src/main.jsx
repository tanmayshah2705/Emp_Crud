import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Add ngrok header globally to prevent free-tier browser warnings from blocking API calls
axios.defaults.headers.common['ngrok-skip-browser-warning'] = '69420';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
