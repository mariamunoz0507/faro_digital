import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './store'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import Dashboard from './pages/Dashboard'
import MapaSIG from './pages/MapaSIG'
import ForoComunitario from './pages/ForoComunitario'
import AportarAvistamiento from './pages/AportarAvistamiento'
import MisReportes from './pages/MisReportes'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reportes" element={<MisReportes />} />
          <Route path="/mapa" element={<MapaSIG />} />
          <Route path="/foro" element={<ForoComunitario />} />
          <Route path="/avistamiento" element={<AportarAvistamiento />} />
        </Routes>
        <BottomNav />
        <Toast />
      </BrowserRouter>
    </AppProvider>
  )
}
