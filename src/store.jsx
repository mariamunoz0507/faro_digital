import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [alertas, setAlertas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [foro, setForo] = useState([])
  const [avistamientos, setAvistamientos] = useState([])
  const [toast, setToast] = useState({ show: false, msg: '' })

  // Cargar todo al iniciar
  useEffect(() => {
    cargarTodo()
  }, [])

  const cargarTodo = async () => {
    setCargando(true)
    await Promise.all([cargarAlertas(), cargarForo(), cargarAvistamientos()])
    setCargando(false)
  }

  // ─── ALERTAS ──────────────────────────────────────────────

  const cargarAlertas = async () => {
    const { data, error } = await supabase
      .from('alertas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error cargando alertas:', error)
    } else {
      setAlertas(data.map(mapearAlerta))
    }
  }

  const mapearAlerta = (a) => ({
    ...a,
    ultimaVez: a.ultima_vez,
  })

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
        estado: 'activa',
        avistamientos: 0,
        voluntarios: 0,
        urgente: nueva.urgente,
        foto: nueva.foto ?? null,
      }])
      .select()

    if (error) {
      console.error('Error guardando alerta:', error)
      mostrarToast('❌ Error al guardar la alerta')
    } else {
      setAlertas(prev => [mapearAlerta(data[0]), ...prev])
      mostrarToast('🚨 Alerta creada y notificada a tu zona')
    }
  }

  const marcarResuelto = async (alertaId, nota = '') => {
    const { error } = await supabase
      .from('alertas')
      .update({
        estado: 'resuelto',
        urgente: false,
        resuelto_nota: nota || null,
        resuelto_at: new Date().toISOString(),
      })
      .eq('id', alertaId)

    if (error) {
      console.error('Error marcando como resuelto:', error)
      mostrarToast('❌ Error al actualizar la alerta')
    } else {
      setAlertas(prev => prev.map(a =>
        a.id === alertaId
          ? { ...a, estado: 'resuelto', urgente: false, resuelto_nota: nota }
          : a
      ))
      mostrarToast('✅ ¡Persona encontrada! Alerta marcada como resuelta')
    }
  }

  // ─── VOLUNTARIOS ──────────────────────────────────────────

  const toggleVoluntario = async (alertaId) => {
    const alerta = alertas.find(a => a.id === alertaId)
    if (!alerta) return

    const nuevoCont = (alerta.voluntarios ?? 0) + 1

    const { error } = await supabase
      .from('alertas')
      .update({ voluntarios: nuevoCont })
      .eq('id', alertaId)

    if (error) {
      console.error('Error actualizando voluntarios:', error)
    } else {
      setAlertas(prev => prev.map(a =>
        a.id === alertaId ? { ...a, voluntarios: nuevoCont } : a
      ))
      mostrarToast('🤝 ¡Te uniste como voluntario!')
    }
  }

  // ─── AVISTAMIENTOS ────────────────────────────────────────

  const cargarAvistamientos = async () => {
    const { data, error } = await supabase
      .from('avistamientos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error cargando avistamientos:', error)
    } else {
      // Mapear alerta_id → alertaId para compatibilidad con el componente
      setAvistamientos(data.map(av => ({ ...av, alertaId: av.alerta_id })))
    }
  }

  const agregarAvistamiento = async (av) => {
    // 1. Insertar en tabla avistamientos
    const { error: errAv } = await supabase
      .from('avistamientos')
      .insert([{
        id: av.id,
        alerta_id: av.alertaId,
        lugar: av.lugar,
        hora: av.hora,
        descripcion: av.descripcion,
        certeza: av.certeza,
        contacto: av.contacto ?? null,
        fecha: av.fecha,
      }])

    if (errAv) {
      console.error('Error guardando avistamiento:', errAv)
      mostrarToast('❌ Error al enviar el avistamiento')
      return
    }

    // 2. Incrementar contador en la alerta
    const alerta = alertas.find(a => a.id === av.alertaId)
    const nuevoCont = (alerta?.avistamientos ?? 0) + 1

    const { error: errAlerta } = await supabase
      .from('alertas')
      .update({ avistamientos: nuevoCont })
      .eq('id', av.alertaId)

    if (!errAlerta) {
      setAlertas(prev => prev.map(a =>
        a.id === av.alertaId ? { ...a, avistamientos: nuevoCont } : a
      ))
    }

    // 3. Actualizar estado local
    setAvistamientos(prev => [{ ...av, alertaId: av.alertaId }, ...prev])
    mostrarToast('✅ Avistamiento enviado. ¡Gracias por ayudar!')
  }

  // ─── FORO ─────────────────────────────────────────────────

  const cargarForo = async () => {
    const { data, error } = await supabase
      .from('foro_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error cargando foro:', error)
    } else {
      // Mapear alerta_id → alertaId para compatibilidad
      setForo(data.map(p => ({ ...p, alertaId: p.alerta_id })))
    }
  }

  const agregarForoPost = async (post) => {
    const { data, error } = await supabase
      .from('foro_posts')
      .insert([{
        id: post.id,
        titulo: post.titulo,
        contenido: post.contenido,
        autor: post.autor,
        avatar: post.avatar,
        hora: post.hora,
        likes: 0,
        replies: 0,
        alerta_id: post.alertaId ?? null,
        tags: post.tags ?? [],
      }])
      .select()

    if (error) {
      console.error('Error guardando post:', error)
      mostrarToast('❌ Error al publicar en el foro')
    } else {
      const guardado = { ...data[0], alertaId: data[0].alerta_id }
      setForo(prev => [guardado, ...prev])
      mostrarToast('💬 Publicación enviada al foro comunitario')
    }
  }

  const darLikePost = async (postId) => {
    const post = foro.find(p => p.id === postId)
    if (!post) return

    const nuevosLikes = (post.likes ?? 0) + 1

    const { error } = await supabase
      .from('foro_posts')
      .update({ likes: nuevosLikes })
      .eq('id', postId)

    if (!error) {
      setForo(prev => prev.map(p =>
        p.id === postId ? { ...p, likes: nuevosLikes } : p
      ))
    }
  }

  // ─── TOAST ────────────────────────────────────────────────

  const mostrarToast = (msg) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast({ show: false, msg: '' }), 2800)
  }

  return (
    <AppContext.Provider value={{
      alertas, cargando, foro, avistamientos,
      agregarAlerta, agregarAvistamiento, agregarForoPost,
      toggleVoluntario, marcarResuelto, darLikePost,
      toast, mostrarToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
