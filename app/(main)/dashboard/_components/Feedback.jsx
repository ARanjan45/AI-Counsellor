import React from 'react'

function Feedback({ room }) {
    const feedback = room?.feedback;

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
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.2rem', fontWeight: 600, color: '#e8e4dd', marginBottom: 20 }}>
                Session Feedback
            </h2>

            {!room ? (
                // No session selected
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 10 }}>
                    <span style={{ fontSize: '2.2rem', opacity: 0.4 }}>✨</span>
                    <p style={{ fontSize: '0.88rem', color: '#8a8a9a', textAlign: 'center', lineHeight: 1.6, maxWidth: 220, margin: 0 }}>
                        Select a session on the left to view its feedback and insights.
                    </p>
                </div>
            ) : !feedback ? (
                // Session selected but no feedback yet
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 10 }}>
                    <span style={{ fontSize: '2.2rem', opacity: 0.4 }}>🌱</span>
                    <p style={{ fontSize: '0.88rem', color: '#8a8a9a', textAlign: 'center', lineHeight: 1.6, maxWidth: 220, margin: 0 }}>
                        No feedback was generated for this session yet.
                    </p>
                </div>
            ) : (
                // Feedback available
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Session name + mood */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                        <p style={{ fontSize: '0.88rem', color: '#e8e4dd', fontWeight: 500, margin: 0 }}>
                            {room.feelingOption}
                        </p>
                        {feedback.mood && (
                            <span style={{
                                fontSize: '0.78rem',
                                background: 'rgba(126,184,154,0.12)',
                                border: '1px solid rgba(126,184,154,0.25)',
                                color: '#7eb89a',
                                padding: '3px 12px',
                                borderRadius: 100,
                            }}>
                                {feedback.mood}
                            </span>
                        )}
                    </div>

                    {/* Summary */}
                    {feedback.summary && (
                        <div>
                            <p style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7eb89a', marginBottom: 6 }}>
                                Summary
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#8a8a9a', lineHeight: 1.65, margin: 0 }}>
                                {feedback.summary}
                            </p>
                        </div>
                    )}

                    {/* Key Points */}
                    {feedback.keyPoints?.length > 0 && (
                        <div>
                            <p style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7eb89a', marginBottom: 8 }}>
                                Key Points
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {feedback.keyPoints.map((point, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                        <span style={{ color: '#7eb89a', fontSize: '0.9rem', marginTop: 1, flexShrink: 0 }}>·</span>
                                        <p style={{ fontSize: '0.85rem', color: '#e8e4dd', margin: 0, lineHeight: 1.5 }}>{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Insights */}
                    {feedback.insights && (
                        <div style={{
                            background: 'rgba(157,142,196,0.07)',
                            border: '1px solid rgba(157,142,196,0.15)',
                            borderRadius: 14,
                            padding: '14px 16px',
                        }}>
                            <p style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9d8ec4', marginBottom: 6 }}>
                                Counsellor Insights
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#8a8a9a', lineHeight: 1.65, margin: 0 }}>
                                {feedback.insights}
                            </p>
                        </div>
                    )}

                    {/* Action Items */}
                    {feedback.actionItems?.length > 0 && (
                        <div>
                            <p style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9d8ec4', marginBottom: 8 }}>
                                Action Items
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {feedback.actionItems.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                        <span style={{ color: '#9d8ec4', fontSize: '0.9rem', marginTop: 1, flexShrink: 0 }}>·</span>
                                        <p style={{ fontSize: '0.85rem', color: '#e8e4dd', margin: 0, lineHeight: 1.5 }}>{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Feedback