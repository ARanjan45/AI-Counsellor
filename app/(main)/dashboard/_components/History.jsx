"use client"
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@stackframe/stack'
import { useRouter } from 'next/navigation'

function History() {
    const rooms = useQuery(api.DiscussionRoom.GetAllRooms, { email: '' });
    const router = useRouter();

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: 28,
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7eb89a', marginBottom: 8 }}>Recent</p>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.2rem', fontWeight: 600, color: '#e8e4dd', marginBottom: 20 }}>
                Previous Sessions
            </h2>

            {!rooms || rooms.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 10 }}>
                    <span style={{ fontSize: '2.2rem', opacity: 0.4 }}>🌿</span>
                    <p style={{ fontSize: '0.88rem', color: '#8a8a9a', textAlign: 'center', lineHeight: 1.6, maxWidth: 220, margin: 0 }}>
                        No sessions yet. Start a conversation and your history will appear here.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {rooms.slice().reverse().map((room, i) => (
                        <div
                            key={i}
                            onClick={() => router.push('/discussion-room/' + room._id)}
                            style={{
                                padding: '14px 16px',
                                borderRadius: 14,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(126,184,154,0.06)';
                                e.currentTarget.style.borderColor = 'rgba(126,184,154,0.2)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                            }}
                        >
                            <p style={{ fontSize: '0.88rem', fontWeight: 500, color: '#e8e4dd', margin: '0 0 4px' }}>
                                {room.feelingOption}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '0.75rem', color: '#8a8a9a' }}>{room.expertName}</span>
                                {room.feedback?.mood && (
                                    <span style={{
                                        fontSize: '0.7rem',
                                        background: 'rgba(126,184,154,0.1)',
                                        border: '1px solid rgba(126,184,154,0.2)',
                                        color: '#7eb89a',
                                        padding: '1px 8px',
                                        borderRadius: 100,
                                    }}>
                                        {room.feedback.mood}
                                    </span>
                                )}
                                {room.conversation && (
                                    <span style={{ fontSize: '0.75rem', color: '#8a8a9a' }}>
                                        · {room.conversation.length} messages
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default History