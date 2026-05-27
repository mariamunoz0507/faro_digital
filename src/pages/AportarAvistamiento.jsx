import React, { useState } from 'react'
import { useApp } from '../store'

export default function AportarAvistamiento() {
  const { alertas, agregarAvistamiento, avistamientos } = useApp()
  const [form, setForm] = useState({
    alertaId: '',
    lugar: '',
    hora: '',
    descripcion: '',
    certeza: '3',
    contacto: '',
    foto: null,
  })
  const [enviado, setEnviado] = useState(false)
  const [enviandoId, setEnviandoId] = useState(null)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.alertaId || !form.lugar || !form.descripcion) return

    const nuevo = {
      id: Date.now(),
      ...form,
      certeza: Number(form.certeza),
      fecha: new Date().toLocaleString('es-CL'),
    }
    agregarAvistamiento(nuevo)
    setEnviandoId(nuevo.id)
    setTimeout(() => {
      setEnviado(true)
    }, 400)
  }

  const certezaLabel = ['', '😕 Muy baja', '🤔 Baja', '🙂 Moderada', '😊 Alta', '✅ Muy alta']

  const alertasActivas = alertas.filter(a => a.estado === 'activa')

  return (
    <div className="page">
      {/* Header */}
      <div className="top-bar">
        <div>
          <div className="top-bar-logo" style={{ fontSize: '1.2rem' }}>👁️ Aportar Avistamiento</div>
          <div className="top-bar-sub">Ayuda a encontrar personas desaparecidas</div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* Impacto */}
        <div className="fade-up card" style={{ marginBottom: 18, background: 'linear-gradient(135deg, #e8eef8, #f0f5ff)', border: '1px solid var(--gris-3)' }}>
          <div style={{ fontFamily: 'var(--font-titulo)', fontWeight: 700, marginBottom: 4 }}>
            🌟 Tu aporte puede salvar vidas
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--gris-texto)', lineHeight: 1.5 }}>
            Los avistamientos reportados por la comunidad son clave en las búsquedas. Cada dato suma.
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-titulo)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--azul)' }}>
                {avistamientos.length + alertas.reduce((a, b) => a + b.avistamientos, 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gris-texto)' }}>Avistamientos totales</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-titulo)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--verde)' }}>
                {alertas.filter(a => a.estado === 'resuelto').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gris-texto)' }}>Personas encontradas</div>
            </div>
          </div>
        </div>

        {enviado ? (
          <div className="fade-up card" style={{ textAlign: 'center', padding: '30px 20px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>✅</div>
            <h2 style={{ fontFamily: 'var(--font-titulo)', color: 'var(--verde)', marginBottom: 8 }}>
              ¡Avistamiento enviado!
            </h2>
            <p style={{ color: 'var(--gris-texto)', fontSize: '0.95rem', marginBottom: 20, lineHeight: 1.5 }}>
              Tu información fue enviada al equipo de búsqueda. Muchas gracias por ayudar a la comunidad.
            </p>
            <button
              className="btn btn-primary btn-full"
              onClick={() => {
                setEnviado(false)
                setForm({ alertaId: '', lugar: '', hora: '', descripcion: '', certeza: '3', contacto: '', foto: null })
              }}
            >
              Reportar otro avistamiento
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="fade-up-2">

            {/* Seleccionar alerta */}
            <div className="section-title" style={{ marginBottom: 16 }}>
              🚨 ¿A quién viste?
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {alertasActivas.length === 0 && (
                <div style={{ color: 'var(--gris-texto)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>
                  No hay alertas activas actualmente
                </div>
              )}
              {alertasActivas.map(a => (
                <div
                  key={a.id}
                  onClick={() => setForm({ ...form, alertaId: a.id })}
                  style={{
                    display: 'flex', gap: 12, alignItems: 'center',
                    padding: '12px 14px',
                    borderRadius: 'var(--radio)',
                    border: form.alertaId === a.id ? '2px solid var(--azul)' : '1.5px solid var(--gris-3)',
                    background: form.alertaId === a.id ? '#e8eef8' : 'var(--blanco)',
                    cursor: 'pointer',
                    transition: 'all .18s',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>👤</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{a.nombre}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gris-texto)' }}>#{a.id} · {a.zona}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gris-texto)' }}>{a.descripcion?.substring(0, 60)}...</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    border: form.alertaId === a.id ? '2px solid var(--azul)' : '2px solid var(--gris-3)',
                    background: form.alertaId === a.id ? 'var(--azul)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: '0.7rem',
                  }}>
                    {form.alertaId === a.id ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>

            {/* Detalles del avistamiento */}
            <div className="section-title" style={{ marginBottom: 14 }}>
              📍 Detalles del avistamiento
            </div>

            <div className="form-group">
              <label className="form-label">Lugar donde lo/la viste *</label>
              <input
                className="form-input"
                name="lugar"
                value={form.lugar}
                onChange={handleChange}
                placeholder="Ej: Calle Esmeralda con Uruguay"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hora aproximada</label>
              <input
                className="form-input"
                name="hora"
                type="time"
                value={form.hora}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">¿Qué viste? Descripción detallada *</label>
              <textarea
                className="form-textarea"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe lo que viste: qué hacía, con quién estaba, hacia dónde iba..."
                required
              />
            </div>

            {/* Certeza */}
            <div className="form-group">
              <label className="form-label">
                Nivel de certeza: {certezaLabel[form.certeza]}
              </label>
              <input
                type="range"
                min="1" max="5"
                name="certeza"
                value={form.certeza}
                onChange={handleChange}
                style={{ width: '100%', accentColor: 'var(--azul)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--gris-texto)', marginTop: 2 }}>
                <span>Poco seguro/a</span>
                <span>Muy seguro/a</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tu contacto (opcional)</label>
              <input
                className="form-input"
                name="contacto"
                value={form.contacto}
                onChange={handleChange}
                placeholder="Número o email por si necesitan más info"
              />
            </div>

            {/* Aviso privacidad */}
            <div style={{
              background: 'var(--gris-2)',
              borderRadius: 'var(--radio-sm)',
              padding: '10px 14px',
              marginBottom: 16,
              fontSize: '0.8rem',
              color: 'var(--gris-texto)',
              lineHeight: 1.5,
            }}>
              🔒 Tu información es tratada con confidencialidad. Solo se comparte con el equipo de búsqueda autorizado.
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={!form.alertaId || !form.lugar || !form.descripcion}
              style={{ fontSize: '1rem', padding: '14px' }}
            >
              Enviar avistamiento
            </button>
          </form>
        )}

        {/* Avistamientos recientes */}
        {avistamientos.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div className="section-title">📋 Tus avistamientos</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {avistamientos.map(av => (
                <div key={av.id} className="card fade-up" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                      Alerta #{av.alertaId}
                    </span>
                    <span className="badge badge-verde">Enviado</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gris-texto)' }}>📍 {av.lugar}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gris-texto)' }}>{av.descripcion?.substring(0, 80)}...</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
