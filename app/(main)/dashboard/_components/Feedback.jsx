import React from 'react'

function Feedback() {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: 28,
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9d8ec4', marginBottom: 8 }}>
                Insights
            </p>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.2rem', fontWeight: 600, color: '#e8e4dd', marginBottom: 24 }}>
                Session Feedback
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 10 }}>
                <span style={{ fontSize: '2.2rem', opacity: 0.4 }}>✨</span>
                <p style={{ fontSize: '0.88rem', color: '#8a8a9a', textAlign: 'center', lineHeight: 1.6, maxWidth: 220, margin: 0 }}>
                    After each session, your counsellor will leave thoughtful feedback and insights here.
                </p>
            </div>
        </div>
    )
}

export default Feedback