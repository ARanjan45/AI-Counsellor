"use client"
import { UserButton } from '@stackframe/stack'
import Link from 'next/link'
import React from 'react'

function AppHeader() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 40px',
      background: 'rgba(15,17,23,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <span style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#7eb89a', display: 'inline-block',
          boxShadow: '0 0 8px #7eb89a'
        }} />
        <span style={{
          fontFamily: "'Lora', serif",
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#e8e4dd'
        }}>
          YouMatter
        </span>
      </Link>
      <UserButton />
    </div>
  )
}

export default AppHeader