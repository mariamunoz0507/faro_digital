import React, { useEffect, useRef, useState } from 'react'
import { useApp } from '../store'

// Leaflet loaded via CDN in index.html
export default function MapaSIG() {
  const { alertas } = useApp()
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const [seleccionada, setSeleccionada] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Dynamic import of leaflet
    const initMap = async () => {
      const L = await import('leaflet')

      if (mapInstance.current) return

      // Fix default icon
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, {
        center: [-33.046, -71.619],
        zoom: 14,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      // Add markers
      alertas.forEach(alerta => {
        const color = alerta.estado === 'resuelto' ? '#27ae60' : '#c0392b'
        const urgColor = alerta.urgente && alerta.estado !== 'resuelto' ? '#e74c3c' : color

        const icon = L.divIcon({
          html: `
            <div style="
              background: ${urgColor};
              width: 36px; height: 36px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 3px 12px rgba(0,0,0,0.3);
              display:flex;align-items:center;justify-content:center;
            ">
              <span style="transform:rotate(45deg);font-size:14px;">
                ${alerta.estado === 'resuelto' ? '✅' : '⚠️'}
              </span>
            </div>
          `,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        })

        const marker = L.marker([alerta.lat, alerta.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:DM Sans,sans-serif;min-width:180px;">
              <b style="color:#1a4fa0">Alerta #${alerta.id}</b><br/>
              <b>${alerta.nombre}</b><br/>
              <span style="color:#5a6a85;font-size:0.85rem">📍 ${alerta.ultimaVez}</span><br/>
              <span style="color:#5a6a85;font-size:0.85rem">🕐 ${alerta.fecha}</span><br/>
              <span style="font-size:0.8rem">${alerta.descripcion}</span>
            </div>
          `)

        marker.on('click', () => setSeleccionada(alerta))
      })

      // Draw coverage zones
      alertas.forEach(alerta => {
        const color = alerta.estado === 'resuelto' ? '#27ae60' : '#c0392b'
        L.circle([alerta.lat, alerta.lng], {
          color,
          fillColor: color,
          fillOpacity: 0.07,
          weight: 1.5,
          radius: 400,
          dashArray: '6,4',
        }).addTo(map)
      })

      mapInstance.current = map
      setCargando(false)
    }

    initMap()
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return (
    <div className="page">
      {/* Header */}
      <div className="top-bar">
        <div>
          <div className="top-bar-logo" style={{ fontSize: '1.2rem' }}>🗺️ Mapa SIG</div>
          <div className="top-bar-sub">Zonas de alerta en tiempo real</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="live-dot"></span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem' }}>En vivo</span>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Leyenda */}
        <div className="fade-up card" style={{ marginBottom: 14, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
            <div style={{ width: 12, height: 12, background: '#c0392b', borderRadius: '50%' }}/>
            Alerta activa
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
            <div style={{ width: 12, height: 12, background: '#27ae60', borderRadius: '50%' }}/>
            Resuelto
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' }}>
            <div style={{ width: 14, height: 14, border: '2px dashed #c0392b', borderRadius: '50%' }}/>
            Zona de búsqueda
          </div>
        </div>

        {/* Mapa */}
        <div className="fade-up-2" style={{ position: 'relative' }}>
          {cargando && (
            <div style={{
              position: 'absolute', inset: 0, zIndex: 10,
              background: 'var(--gris-2)', borderRadius: 'var(--radio)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 10,
            }}>
              <div style={{ fontSize: '2rem' }}>🗺️</div>
              <div style={{ color: 'var(--gris-texto)', fontSize: '0.9rem' }}>Cargando mapa...</div>
            </div>
          )}
          <div ref={mapRef} style={{ height: 340, borderRadius: 'var(--radio)', overflow: 'hidden' }} />
        </div>

        {/* Alerta seleccionada */}
        {seleccionada && (
          <div className="fade-up alerta-card" style={{ marginTop: 14 }}>
            <div style={{
              width: 44, height: 44, minWidth: 44,
              background: 'var(--rojo-bg)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
            }}>👤</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-titulo)', fontWeight: 700 }}>{seleccionada.nombre}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--gris-texto)' }}>📍 {seleccionada.ultimaVez}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--gris-texto)' }}>{seleccionada.descripcion}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <span className="badge badge-rojo">Alerta #{seleccionada.id}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--gris-texto)' }}>👁️ {seleccionada.avistamientos} avistamientos</span>
              </div>
            </div>
            <button
              style={{ background: 'none', color: 'var(--gris-texto)', alignSelf: 'start', fontSize: '1.1rem' }}
              onClick={() => setSeleccionada(null)}
            >✕</button>
          </div>
        )}

        {/* Lista de alertas en mapa */}
        <div className="section-title fade-up-3" style={{ marginTop: 16 }}>
          📍 Alertas en tu zona
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {alertas.filter(a => a.estado === 'activa').map(a => (
            <div
              key={a.id}
              className="card fade-up"
              style={{ display: 'flex', gap: 12, alignItems: 'center', cursor: 'pointer', padding: '12px 14px' }}
              onClick={() => setSeleccionada(a)}
            >
              <span style={{ fontSize: '1.3rem' }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{a.nombre}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gris-texto)' }}>📍 {a.zona}</div>
              </div>
              <span className="badge badge-rojo">{a.avistamientos} avisos</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
