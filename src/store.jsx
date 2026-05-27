import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

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
  const [alertas, setAlertas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [foro, setForo] = useState(foroInicialData)
  const [avistamientos, setAvistamientos] = useState([])
  const [toast, setToast] = useState({ show: false, msg: '' })

  // Cargar alertas desde Supabase al iniciar
  useEffect(() => {
    cargarAlertas()
  }, [])

  const cargarAlertas = async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('alertas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error cargando alertas:', error)
    } else {
      // Mapear columnas de Supabase al formato del app
      const mapeadas = data.map(a => ({
        ...a,
        ultimaVez: a.ultima_vez,
      }))
      setAlertas(mapeadas)
    }
    setCargando(false)
  }

  const mostrarToast = (msg) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast({ show: false, msg: '' }), 2800)
  }

  const agregarAlerta = async (nueva) => {
    const { data, error } = await supabase
      .from('alertas')
      .insert([{
        id: nueva.id,
        nombre: nueva.nombre,
        edad: nueva.edad,
        descripcion: nueva.descripcion,
        ultima_vez: nueva.ultimaVez,
        fecha: nueva.fecha,
        zona: nueva.zona,
        lat: nueva.lat,
        lng: nueva.lng,
        estado: nueva.estado,
        avistamientos: nueva.avistamientos,
        voluntarios: nueva.voluntarios,
        urgente: nueva.urgente,
        foto: nueva.foto,
      }])
      .select()

    if (error) {
      console.error('Error guardando alerta:', error)
      mostrarToast('❌ Error al guardar la alerta')
    } else {
      const guardada = { ...data[0], ultimaVez: data[0].ultima_vez }
      setAlertas(prev => [guardada, ...prev])
      mostrarToast('🚨 Alerta creada y notificada a tu zona')
    }
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
      alertas, cargando, foro, avistamientos,
      agregarAlerta, agregarAvistamiento, agregarForoPost, toggleVoluntario,
      toast, mostrarToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)