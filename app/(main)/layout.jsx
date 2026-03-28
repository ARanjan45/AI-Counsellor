import React from 'react'
import AppHeader from './_components/AppHeader'

function DashboardLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', position: 'relative' }}>
      {/* Ambient orbs */}
      <div style={{
        position: 'fixed', width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(126,184,154,0.1)', filter: 'blur(90px)',
        top: -80, left: -80, pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat 14s ease-in-out infinite'
      }} />
      <div style={{
        position: 'fixed', width: 350, height: 350, borderRadius: '50%',
        background: 'rgba(157,142,196,0.08)', filter: 'blur(90px)',
        bottom: '10%', right: -60, pointerEvents: 'none', zIndex: 0,
        animation: 'orbFloat 14s ease-in-out infinite', animationDelay: '-6s'
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes orbFloat {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(15px, -20px); }
        }
        body { background: #0f1117 !important; color: #e8e4dd !important; }
      `}</style>

      <AppHeader />
      <div style={{
        position: 'relative', zIndex: 2,
        maxWidth: 1200, margin: '0 auto',
        padding: '100px 32px 48px'
      }}>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout