import React from 'react'
import { useApp } from '../store'

export default function Toast() {
  const { toast } = useApp()
  return (
    <div className={`toast ${toast.show ? 'show' : ''}`}>
      {toast.msg}
    </div>
  )
}
