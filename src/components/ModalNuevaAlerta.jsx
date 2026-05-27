import React, { useState } from 'react'
import { useApp } from '../store'

export default function ModalNuevaAlerta({ onClose }) {
  const { agregarAlerta } = useApp()
  const [form, setForm] = useState({
    nombre: '', edad: '', descripcion: '', ultimaVez: '', fecha: '', zona: 'Valparaíso Centro',
  })
  const [paso, setPaso] = useState(1)
  const [enviado, setEnviado] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.nombre || !form.descripcion || !form.ultimaVez) return
    const nueva = {
      id: String(Math.floor(Math.random() * 900) + 100),
      ...form,
      edad: Number(form.edad) || 0,
      estado: 'activa',
      avistamientos: 0,
      voluntarios: 0,
      urgente: true,
      lat: -33.046 + (Math.random() - 0.5) * 0.03,
      lng: -71.619 + (Math.random() - 0.5) * 0.03,
      foto: null,
    }
    agregarAlerta(nueva)
    setEnviado(true)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"/>

        {enviado ? (
          <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🚨</div>
            <h2 style={{ fontFamily: 'var(--font-titulo)', color: 'var(--rojo)', marginBottom: 8 }}>
              Alerta Enviada
            </h2>
            <p style={{ color: 'var(--gris-texto)', fontSize: '0.95rem', marginBottom: 24 }}>
              Tu alerta ha sido publicada y notificada a los voluntarios en tu zona.
            </p>
            <button className="btn btn-primary btn-full" onClick={onClose}>
              Ver en el dashboard
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-titulo)', fontSize: '1.2rem', color: 'var(--rojo)' }}>
                🚨 Nueva Alerta Urgente
              </h2>
              <button onClick={onClose} style={{ background: 'none', fontSize: '1.2rem', color: 'var(--gris-texto)' }}>✕</button>
            </div>

            {/* Pasos */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[1, 2].map(p => (
                <div key={p} style={{
                  flex: 1, height: 4, borderRadius: 99,
                  background: p <= paso ? 'var(--rojo)' : 'var(--gris-3)',
                  transition: 'background .3s',
                }}/>
              ))}
            </div>

            {paso === 1 && (
              <div>
                <div className="form-group">
                  <label className="form-label">Nombre completo *</label>
                  <input className="form-input" name="nombre" value={form.nombre}
                    onChange={handleChange} placeholder="Ej: Juan Pérez" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Edad</label>
                    <input className="form-input" name="edad" type="number" value={form.edad}
                      onChange={handleChange} placeholder="Ej: 34" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Zona</label>
                    <select className="form-select" name="zona" value={form.zona} onChange={handleChange}>
                      <option>Valparaíso Centro</option>
                      <option>Cerro Alegre</option>
                      <option>Valparaíso Norte</option>
                      <option>Puerto</option>
                      <option>Playa Ancha</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción física *</label>
                  <textarea className="form-textarea" name="descripcion" value={form.descripcion}
                    onChange={handleChange} placeholder="Ropa que vestía, características físicas..." />
                </div>
                <button
                  className="btn btn-rojo btn-full"
                  style={{ animation: 'none' }}
                  onClick={() => setPaso(2)}
                  disabled={!form.nombre || !form.descripcion}
                >
                  Siguiente →
                </button>
              </div>
            )}

            {paso === 2 && (
              <div>
                <div className="form-group">
                  <label className="form-label">Último lugar visto *</label>
                  <input className="form-input" name="ultimaVez" value={form.ultimaVez}
                    onChange={handleChange} placeholder="Ej: Plaza Central, Valparaíso" />
                </div>
                <div className="form-group">
                  <label className="form-label">Fecha y hora</label>
                  <input className="form-input" name="fecha" value={form.fecha}
                    onChange={handleChange} placeholder="Ej: 20/05/2026 14:00" />
                </div>
                <div style={{
                  background: 'var(--rojo-bg)',
                  borderRadius: 'var(--radio-sm)',
                  padding: '12px 14px',
                  marginBottom: 16,
                  fontSize: '0.85rem',
                  color: 'var(--rojo)',
                }}>
                  ⚠️ Al enviar esta alerta, se notificará a todos los voluntarios registrados en tu zona de cobertura.
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-outline" onClick={() => setPaso(1)} style={{ flex: 1 }}>
                    ← Atrás
                  </button>
                  <button
                    className="btn btn-rojo"
                    style={{ flex: 2, animation: 'none' }}
                    onClick={handleSubmit}
                    disabled={!form.ultimaVez}
                  >
                    🚨 Publicar Alerta
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
