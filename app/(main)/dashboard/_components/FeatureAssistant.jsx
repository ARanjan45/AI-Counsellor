"use client"
import React, { useState } from 'react'
import { useUser } from '@stackframe/stack'
import { ExpertList } from '@/services/Options';
import Image from 'next/image';
import { BlurFade } from "@/components/ui/blur-fade"
import UserInputDialog from './UserInputDialog';

function ExpertCard({ option }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '28px 16px',
                borderRadius: 20,
                background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                border: hovered ? '1px solid rgba(126,184,154,0.3)' : '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer',
                overflow: 'hidden',
                minHeight: 170,
                width: '100%',
                transition: 'all 0.3s ease',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered ? '0 8px 32px rgba(126,184,154,0.1)' : 'none',
            }}
        >
            <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at 50% 0%, rgba(126,184,154,0.1), transparent 70%)',
                opacity: hovered ? 1 : 0,
                transition: 'opacity 0.3s',
                borderRadius: 20,
                pointerEvents: 'none',
            }} />
            <Image
                src={option.icon}
                alt={option.name}
                width={64}
                height={64}
                style={{
                    objectFit: 'contain',
                    width: 64, height: 64,
                    position: 'relative', zIndex: 1,
                    transform: hovered ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.3s',
                }}
            />
            <p style={{
                position: 'relative', zIndex: 1,
                fontSize: '0.82rem', fontWeight: 500,
                color: hovered ? '#7eb89a' : '#8a8a9a',
                textAlign: 'center', lineHeight: 1.4,
                transition: 'color 0.3s', margin: 0,
                fontFamily: "'DM Sans', sans-serif",
            }}>
                {option.name}
            </p>
            <div style={{
                position: 'absolute', bottom: 0,
                left: '50%', transform: 'translateX(-50%)',
                width: hovered ? '60%' : '0%', height: 2,
                background: 'linear-gradient(90deg, #7eb89a, #9d8ec4)',
                borderRadius: 100,
                transition: 'width 0.3s ease',
            }} />
        </div>
    )
}

function FeatureAssistant() {
    const user = useUser();
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
                <div>
                    <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eb89a', marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                        My Workspace
                    </p>
                    <h2 style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 600, color: '#e8e4dd', lineHeight: 1.2, margin: 0 }}>
                        Welcome back,{' '}
                        <span style={{ color: '#7eb89a', fontStyle: 'italic' }}>{user?.displayName || 'friend'}</span>
                    </h2>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: 16 }}>
                {ExpertList.map((option, index) => (
                    <BlurFade key={index} delay={0.1 + index * 0.08} inView>
                        <UserInputDialog ExpertList={option}>
                            <ExpertCard option={option} />
                        </UserInputDialog>
                    </BlurFade>
                ))}
            </div>
        </div>
    )
}

export default FeatureAssistant