import React, { useState } from 'react'
import { useApp } from '../store'

export default function ForoComunitario() {
  const { foro, agregarForoPost, darLikePost, alertas } = useApp()
  const [modalNuevo, setModalNuevo] = useState(false)
  const [form, setForm] = useState({ titulo: '', contenido: '', alertaId: '', tag: 'general' })
  const [likesLocales, setLikesLocales] = useState({}) // ids que YO di like en esta sesión
  const [filtroTag, setFiltroTag] = useState('todos')

  const tags = ['todos', 'avistamiento', 'voluntarios', 'seguridad', 'organización', 'general']

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = () => {
    if (!form.titulo || !form.contenido) return
    agregarForoPost({
      id: Date.now(),
      titulo: form.titulo,
      contenido: form.contenido,
      alertaId: form.alertaId || null,
      autor: 'Tú',
      avatar: '🙋',
      hora: 'ahora',
      likes: 0,
      replies: 0,
      tags: [form.tag],
    })
    setForm({ titulo: '', contenido: '', alertaId: '', tag: 'general' })
    setModalNuevo(false)
  }

  const toggleLike = (id) => {
    // Si ya di like en esta sesión, no hacer nada (evitar doble like)
    if (likesLocales[id]) return
    setLikesLocales(prev => ({ ...prev, [id]: true }))
    darLikePost(id)
  }

  const foroFiltrado = filtroTag === 'todos'
    ? foro
    : foro.filter(p => p.tags && p.tags.includes(filtroTag))

  return (
    <div className="page">
      {/* Header */}
      <div className="top-bar">
        <div>
          <div className="top-bar-logo" style={{ fontSize: '1.2rem' }}>👥 Foro Comunitario</div>
          <div className="top-bar-sub">Coordina la búsqueda en tu zona</div>
        </div>
        <button
          className="btn btn-primary"
          style={{ marginLeft: 'auto', padding: '8px 14px', fontSize: '0.82rem', animation: 'none' }}
          onClick={() => setModalNuevo(true)}
        >
          + Publicar
        </button>
      </div>

      <div style={{ padding: '16px' }}>

        {/* Stats del foro */}
        <div className="fade-up" style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div className="stat-chip">
            <div className="stat-chip-num">{foro.length}</div>
            <div className="stat-chip-label">Publicaciones</div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-num">{foro.reduce((a, b) => a + (b.replies ?? 0), 0)}</div>
            <div className="stat-chip-label">Respuestas</div>
          </div>
          <div className="stat-chip">
            <div className="stat-chip-num">{foro.reduce((a, b) => a + (b.likes ?? 0), 0)}</div>
            <div className="stat-chip-label">Apoyos</div>
          </div>
        </div>

        {/* Filtros por tag */}
        <div className="fade-up-2" style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {tags.map(t => (
            <button
              key={t}
              onClick={() => setFiltroTag(t)}
              style={{
                padding: '5px 12px',
                borderRadius: '99px',
                fontSize: '0.78rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                border: filtroTag === t ? 'none' : '1.5px solid var(--gris-3)',
                background: filtroTag === t ? 'var(--azul)' : 'var(--blanco)',
                color: filtroTag === t ? 'white' : 'var(--gris-texto)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {t === 'todos' ? '🌐 Todos' :
               t === 'avistamiento' ? '👁️ Avistamiento' :
               t === 'voluntarios' ? '🤝 Voluntarios' :
               t === 'seguridad' ? '🛡️ Seguridad' :
               t === 'organización' ? '📋 Org.' : '💬 General'}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {foroFiltrado.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--gris-texto)', padding: '40px 0', fontSize: '0.9rem' }}>
              No hay publicaciones en esta categoría aún
            </div>
          )}
          {foroFiltrado.map((post, i) => (
            <div key={post.id} className="foro-card fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 38, height: 38,
                  background: 'var(--gris-2)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem',
                }}>
                  {post.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{post.autor}</div>
                  <div style={{ fontSize: '0.77rem', color: 'var(--gris-texto)' }}>{post.hora}</div>
                </div>
                {post.alertaId && (
                  <span className="badge badge-rojo">Alerta #{post.alertaId}</span>
                )}
              </div>

              <h3 style={{ fontFamily: 'var(--font-titulo)', fontSize: '0.97rem', marginBottom: 6 }}>
                {post.titulo}
              </h3>
              <p style={{ fontSize: '0.87rem', color: 'var(--gris-texto)', lineHeight: 1.55, marginBottom: 12 }}>
                {post.contenido}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {post.tags.map(tag => (
                    <span key={tag} className="badge badge-azul">#{tag}</span>
                  ))}
                </div>
              )}

              {/* Acciones */}
              <div style={{ display: 'flex', gap: 12, borderTop: '1px solid var(--gris-2)', paddingTop: 10 }}>
                <button
                  onClick={() => toggleLike(post.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'none', fontSize: '0.83rem',
                    color: likesLocales[post.id] ? 'var(--rojo-vivo)' : 'var(--gris-texto)',
                    fontWeight: likesLocales[post.id] ? 600 : 400,
                    transition: 'all .18s',
                    cursor: likesLocales[post.id] ? 'default' : 'pointer',
                  }}
                >
                  {likesLocales[post.id] ? '❤️' : '🤍'} {post.likes ?? 0}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', fontSize: '0.83rem', color: 'var(--gris-texto)' }}>
                  💬 {post.replies ?? 0}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', fontSize: '0.83rem', color: 'var(--gris-texto)', marginLeft: 'auto' }}>
                  🔗 Compartir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal nuevo post */}
      {modalNuevo && (
        <div className="modal-overlay" onClick={() => setModalNuevo(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle"/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h2 style={{ fontFamily: 'var(--font-titulo)', fontSize: '1.15rem' }}>💬 Nueva publicación</h2>
              <button onClick={() => setModalNuevo(false)} style={{ background: 'none', fontSize: '1.2rem', color: 'var(--gris-texto)' }}>✕</button>
            </div>

            <div className="form-group">
              <label className="form-label">Título *</label>
              <input className="form-input" name="titulo" value={form.titulo}
                onChange={handleChange} placeholder="¿Sobre qué quieres publicar?" />
            </div>

            <div className="form-group">
              <label className="form-label">Mensaje *</label>
              <textarea className="form-textarea" name="contenido" value={form.contenido}
                onChange={handleChange} placeholder="Escribe tu mensaje aquí..." style={{ minHeight: 100 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Categoría</label>
                <select className="form-select" name="tag" value={form.tag} onChange={handleChange}>
                  <option value="general">💬 General</option>
                  <option value="avistamiento">👁️ Avistamiento</option>
                  <option value="voluntarios">🤝 Voluntarios</option>
                  <option value="seguridad">🛡️ Seguridad</option>
                  <option value="organización">📋 Organización</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Relacionar a alerta</label>
                <select className="form-select" name="alertaId" value={form.alertaId} onChange={handleChange}>
                  <option value="">Ninguna</option>
                  {alertas.filter(a => a.estado === 'activa').map(a => (
                    <option key={a.id} value={a.id}>#{a.id} {a.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handleSubmit}
              disabled={!form.titulo || !form.contenido}
            >
              Publicar en el foro
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
