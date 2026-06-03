import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store'
import ModalNuevaAlerta from '../components/ModalNuevaAlerta'

export default function Dashboard() {
  const { alertas, toggleVoluntario, marcarResuelto } = useApp()
  const navigate = useNavigate()
  const [modalAlerta, setModalAlerta] = useState(false)
  const [filtro, setFiltro] = useState('activa')

  const activas = alertas.filter(a => a.estado === 'activa')
  const filtradas = filtro === 'todas' ? alertas : alertas.filter(a => a.estado === filtro)

  return (
    <div className="page">
      {/* Top bar */}
      <div className="top-bar">
        <div className="faro-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 2L8 6H4l2 4-4 2 4 2-2 4h4l4 4 4-4h4l-2-4 4-2-4-2 2-4h-4z"/>
          </svg>
        </div>
        <div>
          <div className="top-bar-logo">FARO DIGITAL</div>
          <div className="top-bar-sub">Dashboard y Alertas · Valparaíso</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="live-dot"></span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem' }}>{activas.length} activas</span>
        </div>
      </div>

      <div style={{ padding: '18px 16px 0' }}>

        {/* Stats */}
        <div className="fade-up" style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
          <div className="stat-chip">
            <div className="stat-chip-num" style={{ color: 'var(--rojo)' }}>{activas.length}</div>
            <div className="stat-chip-label">Alertas activas</div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-num">{alertas.reduce((a, b) => a + (b.voluntarios ?? 0), 0)}</div>
            <div className="stat-chip-label">Voluntarios</div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-num" style={{ color: 'var(--verde)' }}>{alertas.filter(a => a.estado === 'resuelto').length}</div>
            <div className="stat-chip-label">Resueltos</div>
          </div>
        </div>

        {/* CTAs */}
        <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <button
            className="btn btn-rojo"
            style={{ flexDirection: 'column', gap: 6, padding: '18px 12px', borderRadius: 'var(--radio)', height: 'auto' }}
            onClick={() => setModalAlerta(true)}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>GENERAR ALERTA</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 400 }}>Reportar persona desaparecida</div>
            </div>
          </button>

          <button
            className="btn btn-primary"
            style={{ flexDirection: 'column', gap: 6, padding: '18px 12px', borderRadius: 'var(--radio)', height: 'auto', animation: 'none' }}
            onClick={() => navigate('/foro')}
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <div style={{ textAlign: 'center', lineHeight: 1.3 }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>BÚSQUEDA</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 400 }}>Ver alertas en tu zona</div>
            </div>
          </button>
        </div>

        {/* Filtros */}
        <div className="fade-up-3" style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {['activa', 'resuelto', 'todas'].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: '6px 14px',
                borderRadius: '99px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: filtro === f ? 'none' : '1.5px solid var(--gris-3)',
                background: filtro === f ? 'var(--azul)' : 'var(--blanco)',
                color: filtro === f ? 'white' : 'var(--gris-texto)',
                cursor: 'pointer',
                transition: 'all .18s',
              }}
            >
              {f === 'activa' ? '🔴 Activas' : f === 'resuelto' ? '✅ Resueltas' : '📋 Todas'}
            </button>
          ))}
        </div>

        {/* Alertas list */}
        <div className="section-title fade-up-3">
          <span>⚠️</span>
          Alertas Activas — Última 24h
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="fade-up-4">
          {filtradas.map(alerta => (
            <AlertaCard
              key={alerta.id}
              alerta={alerta}
              onVerMapa={() => navigate('/mapa')}
              onVoluntario={() => toggleVoluntario(alerta.id)}
              onAvistar={() => navigate('/avistamiento')}
              onResuelto={() => marcarResuelto(alerta.id)}
            />
          ))}
          {filtradas.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--gris-texto)', padding: '40px 0', fontSize: '0.95rem' }}>
              ✅ No hay alertas en esta categoría
            </div>
          )}
        </div>
      </div>

      {modalAlerta && <ModalNuevaAlerta onClose={() => setModalAlerta(false)} />}
    </div>
  )
}

function AlertaCard({ alerta, onVerMapa, onVoluntario, onAvistar, onResuelto }) {
  const [expandido, setExpandido] = useState(false)
  const [confirmando, setConfirmando] = useState(false)

  const handleResuelto = (e) => {
    e.stopPropagation()
    if (confirmando) {
      onResuelto()
      setConfirmando(false)
      setExpandido(false)
    } else {
      setConfirmando(true)
      // Auto-cancelar confirmación después de 4 segundos
      setTimeout(() => setConfirmando(false), 4000)
    }
  }

  return (
    <div
      className={`alerta-card ${alerta.estado === 'resuelto' ? 'resuelto' : ''}`}
      onClick={() => setExpandido(!expandido)}
    >
      {/* Avatar */}
      <div style={{
        width: 52, height: 52, minWidth: 52,
        background: alerta.estado === 'resuelto' ? '#e8f8ef' : 'var(--rojo-bg)',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem',
      }}>
        {alerta.estado === 'resuelto' ? '✅' : '👤'}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-titulo)', fontWeight: 700, fontSize: '0.97rem' }}>
            {alerta.nombre}
          </span>
          <span className={`badge ${alerta.estado === 'resuelto' ? 'badge-verde' : 'badge-rojo'}`}>
            {alerta.estado === 'resuelto' ? '✅ Encontrado' : '🔴 Activa'}
          </span>
          {alerta.urgente && alerta.estado !== 'resuelto' && (
            <span className="badge badge-amarillo">⚡ Urgente</span>
          )}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--gris-texto)', marginTop: 3 }}>
          Alerta #{alerta.id} · {alerta.edad} años
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--gris-texto)', marginTop: 2 }}>
          📍 {alerta.ultimaVez}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--gris-texto)', marginTop: 1 }}>
          🕐 {alerta.fecha}
        </div>

        {expandido && (
          <div style={{ marginTop: 10, animation: 'fadeUp .25s ease both' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--texto)', marginBottom: 8 }}>
              {alerta.descripcion}
            </div>

            {/* Info resuelto */}
            {alerta.estado === 'resuelto' && alerta.resuelto_nota && (
              <div style={{
                background: '#e8f8ef',
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: '0.82rem',
                color: '#27ae60',
                marginBottom: 8,
              }}>
                📝 {alerta.resuelto_nota}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--gris-texto)' }}>
                👁️ {alerta.avistamientos ?? 0} avistamientos
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--gris-texto)' }}>
                🤝 {alerta.voluntarios ?? 0} voluntarios
              </span>
            </div>

            {alerta.estado !== 'resuelto' && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={(e) => { e.stopPropagation(); onVoluntario(); }}
                >
                  🤝 Ser voluntario
                </button>
                <button
                  className="btn btn-outline"
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  onClick={(e) => { e.stopPropagation(); onAvistar(); }}
                >
                  👁️ Avistar
                </button>
                <button
                  className="btn"
                  style={{ padding: '8px 14px', fontSize: '0.82rem', background: 'var(--gris-2)', color: 'var(--texto)' }}
                  onClick={(e) => { e.stopPropagation(); onVerMapa(); }}
                >
                  🗺️ Ver mapa
                </button>

                {/* Botón marcar como encontrado */}
                <button
                  className="btn"
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    background: confirmando ? '#27ae60' : '#e8f8ef',
                    color: confirmando ? 'white' : '#27ae60',
                    border: '1.5px solid #27ae60',
                    transition: 'all .2s',
                    fontWeight: confirmando ? 700 : 500,
                  }}
                  onClick={handleResuelto}
                >
                  {confirmando ? '¿Confirmar? Toca de nuevo ✓' : '✅ Persona encontrada'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ color: 'var(--gris-texto)', fontSize: '1.1rem', alignSelf: 'center' }}>
        {expandido ? '▲' : '▼'}
      </div>
    </div>
  )
}
