import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NavItem = ({ icon, label, path, active, onClick }) => (
  <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    <span>{label}</span>
  </button>
)

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname

  const items = [
    {
      path: '/', label: 'Inicio',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={path === '/' ? '#1a4fa0' : '#5a6a85'} strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
    },
    {
      path: '/reportes', label: 'Reportes',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={path === '/reportes' ? '#1a4fa0' : '#5a6a85'} strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
    },
    {
      path: '/mapa', label: 'Mapa SIG',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={path === '/mapa' ? '#1a4fa0' : '#5a6a85'} strokeWidth="2">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
          <line x1="8" y1="2" x2="8" y2="18"/>
          <line x1="16" y1="6" x2="16" y2="22"/>
        </svg>
      ),
    },
    {
      path: '/foro', label: 'Comunidad',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={path === '/foro' ? '#1a4fa0' : '#5a6a85'} strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      path: '/avistamiento', label: 'Avistar',
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={path === '/avistamiento' ? '#1a4fa0' : '#5a6a85'} strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
        </svg>
      ),
    },
  ]

  return (
    <nav className="bottom-nav">
      {items.map(item => (
        <NavItem
          key={item.path}
          {...item}
          active={path === item.path}
          onClick={() => navigate(item.path)}
        />
      ))}
    </nav>
  )
}
