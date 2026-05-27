// Global state store (simple context)
import React, { createContext, useContext, useState } from 'react'

export const alertasIniciales = [
  {
    id: '015',
    nombre: 'Juan Pérez',
    edad: 34,
    ultimaVez: 'Plaza Central, Valparaíso',
    fecha: '16/05/2026 18:00',
    descripcion: 'Chamarra negra, jeans azules, mochila roja. Cabello oscuro corto.',
    zona: 'Valparaíso Centro',
    lat: -33.046,
    lng: -71.619,
    estado: 'activa',
    avistamientos: 3,
    voluntarios: 12,
    foto: null,
    urgente: true,
  },
  {
    id: '016',
    nombre: 'María González',
    edad: 67,
    ultimaVez: 'Av. Argentina, Valparaíso',
    fecha: '17/05/2026 09:30',
    descripcion: 'Vestido floreado rosado, zapatillas blancas. Cabello canoso.',
    zona: 'Valparaíso Norte',
    lat: -33.039,
    lng: -71.625,
    estado: 'activa',
    avistamientos: 1,
    voluntarios: 8,
    foto: null,
    urgente: true,
  },
  {
    id: '014',
    nombre: 'Carlos Fuentes',
    edad: 16,
    ultimaVez: 'Cerro Alegre',
    fecha: '14/05/2026 21:00',
    descripcion: 'Polera blanca, pantalón negro, audífonos negros.',
    zona: 'Cerro Alegre',
    lat: -33.050,
    lng: -71.613,
    estado: 'resuelto',
    avistamientos: 7,
    voluntarios: 20,
    foto: null,
    urgente: false,
  },
]

export const foroInicialData = [
  {
    id: 1,
    titulo: 'Avistamiento en Mercado Puerto',
    autor: 'Claudia M.',
    avatar: '👩',
    hora: 'hace 15 min',
    contenido: 'Vi a alguien con descripción similar al caso #015 cerca del mercado puerto a las 17:45. Llevaba mochila roja.',
    likes: 8,
    replies: 3,
    alertaId: '015',
    tags: ['avistamiento', 'urgente'],
  },
  {
    id: 2,
    titulo: 'Voluntarios zona cerro',
    autor: 'Roberto L.',
    avatar: '👨',
    hora: 'hace 1h',
    contenido: 'Organizando grupo de búsqueda para Cerro Alegre esta tarde a las 16:00. ¿Quién se une? Nos encontramos en la plaza.',
    likes: 14,
    replies: 9,
    alertaId: null,
    tags: ['voluntarios', 'organización'],
  },
  {
    id: 3,
    titulo: 'Protocolo de búsqueda nocturna',
    autor: 'Ana K.',
    avatar: '👩‍⚕️',
    hora: 'hace 3h',
    contenido: 'Recordar llevar linterna, agua y teléfono cargado. No búsqueda en zonas de riesgo sin coordinación con carabineros.',
    likes: 22,
    replies: 5,
    alertaId: null,
    tags: ['seguridad', 'protocolo'],
  },
]

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [alertas, setAlertas] = useState(alertasIniciales)
  const [foro, setForo] = useState(foroInicialData)
  const [avistamientos, setAvistamientos] = useState([])
  const [toast, setToast] = useState({ show: false, msg: '' })

  const mostrarToast = (msg) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast({ show: false, msg: '' }), 2800)
  }

  const agregarAlerta = (nueva) => {
    setAlertas(prev => [nueva, ...prev])
    mostrarToast('🚨 Alerta creada y notificada a tu zona')
  }

  const agregarAvistamiento = (av) => {
    setAvistamientos(prev => [av, ...prev])
    setAlertas(prev => prev.map(a =>
      a.id === av.alertaId ? { ...a, avistamientos: a.avistamientos + 1 } : a
    ))
    mostrarToast('✅ Avistamiento enviado. ¡Gracias por ayudar!')
  }

  const agregarForoPost = (post) => {
    setForo(prev => [post, ...prev])
    mostrarToast('💬 Publicación enviada al foro comunitario')
  }

  const toggleVoluntario = (alertaId) => {
    setAlertas(prev => prev.map(a =>
      a.id === alertaId ? { ...a, voluntarios: a.voluntarios + 1 } : a
    ))
    mostrarToast('🤝 ¡Te uniste como voluntario!')
  }

  return (
    <AppContext.Provider value={{
      alertas, foro, avistamientos,
      agregarAlerta, agregarAvistamiento, agregarForoPost, toggleVoluntario,
      toast, mostrarToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
