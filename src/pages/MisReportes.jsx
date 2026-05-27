import React, { useState } from 'react'
import { useApp } from '../store'

export default function MisReportes() {
  const { alertas } = useApp()
  const [tab, setTab] = useState('activas')

  const activas = alertas.filter(a => a.estado === 'activa')
  const resueltas = alertas.filter(a => a.estado === 'resuelto')

  return (
    <div className="page">
      <div className="top-bar">
        <div>
          <div className="top-bar-logo" style={{ fontSize: '1.2rem' }}>📋 Mis Reportes</div>
          <div className="top-bar-sub">Historial de alertas</div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* Tabs */}
        <div className="fade-up" style={{ display: 'flex', background: 'var(--gris-2)', borderRadius: 'var(--radio-sm)', padding: 4, marginBottom: 18 }}>
          {[['activas', `🔴 Activas (${activas.length})`], ['resueltas', `✅ Resueltas (${resueltas.length})`]].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 'calc(var(--radio-sm) - 2px)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: tab === key ? 'var(--blanco)' : 'transparent',
                color: tab === key ? 'var(--texto)' : 'var(--gris-texto)',
                boxShadow: tab === key ? 'var(--sombra)' : 'none',
                transition: 'all .18s',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(tab === 'activas' ? activas : resueltas).map((a, i) => (
            <div key={a.id} className="card fade-up" style={{ animationDelay: `${i * 0.07}s`, borderLeft: `4px solid ${a.estado === 'resuelto' ? 'var(--verde)' : 'var(--rojo)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 44, height: 44, background: a.estado === 'resuelto' ? '#e8f8ef' : 'var(--rojo-bg)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                  👤
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-titulo)', fontWeight: 700 }}>{a.nombre}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--gris-texto)' }}>Alerta #{a.id} · {a.edad} años</div>
                </div>
                <span className={`badge ${a.estado === 'resuelto' ? 'badge-verde' : 'badge-rojo'}`}>
                  {a.estado === 'resuelto' ? '✅ Encontrado' : '🔴 Activa'}
                </span>
              </div>

              <div style={{ fontSize: '0.83rem', color: 'var(--gris-texto)', marginBottom: 6 }}>
                📍 {a.ultimaVez}
              </div>
              <div style={{ fontSize: '0.83rem', color: 'var(--gris-texto)', marginBottom: 10 }}>
                {a.descripcion}
              </div>

              <div style={{ display: 'flex', gap: 14, paddingTop: 10, borderTop: '1px solid var(--gris-2)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--gris-texto)' }}>
                  👁️ {a.avistamientos} avistamientos
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gris-texto)' }}>
                  🤝 {a.voluntarios} voluntarios
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gris-texto)' }}>
                  📍 {a.zona}
                </div>
              </div>
            </div>
          ))}

          {(tab === 'activas' ? activas : resueltas).length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--gris-texto)', padding: '50px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>
                {tab === 'activas' ? '🎉' : '📋'}
              </div>
              <div style={{ fontSize: '0.95rem' }}>
                {tab === 'activas' ? 'No hay alertas activas' : 'No hay alertas resueltas aún'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
