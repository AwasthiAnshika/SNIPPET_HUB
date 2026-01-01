import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import SearchPage from './pages/SearchPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import { AuthProvider } from './state/auth.jsx'
import { setupAxiosLogging } from './utils/axiosLogger.js'

// Setup axios logging
setupAxiosLogging()

function App() {
  return (
    <AuthProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
