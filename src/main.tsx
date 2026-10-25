import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LandingPage from './components/LandingPage.tsx'
<<<<<<< HEAD
import { TranslationProvider } from './context/TranslationContext.tsx'
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

const isDashboardRoute = window.location.pathname.replace(/\/$/, '') === '/dashboard'
const RootPage = isDashboardRoute ? App : LandingPage

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<<<<<<< HEAD
    <TranslationProvider>
      <RootPage />
    </TranslationProvider>
=======
    <RootPage />
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
  </StrictMode>,
)
