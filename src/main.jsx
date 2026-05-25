import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { VibelyNotificationProvider } from './components/VibelyNotificationProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <VibelyNotificationProvider>
      <App />
    </VibelyNotificationProvider>
  </StrictMode>,
)
