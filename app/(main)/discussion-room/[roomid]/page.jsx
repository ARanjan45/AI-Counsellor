"use client"
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { ExpertOptions } from '@/services/Options';
import { LoaderPinwheel } from 'lucide-react';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import dynamic from 'next/dynamic';
import { getToken, AIModel, textToSpeech } from '@/services/GlobalServices';
const RecordRTC = dynamic(() => import('recordrtc'), { ssr: false });

function DiscussionRoom() {
    const { roomid } = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid })
    const [expert, setExpert] = useState();
    const [enableMic, setEnableMic] = useState(false);
    const [transcribe, setTranscribe] = useState('');
    const [conversation, setConversation] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const recorder = useRef(null);
    const realtimeTranscriber = useRef(null);
    const silenceTimeout = useRef(null);
    const texts = useRef({});
    const isCancelled = useRef(false);
    const isProcessing = useRef(false);
    const aiCallTimeout = useRef(null);
    const currentAudio = useRef(null);
    const conversationRef = useRef([]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (DiscussionRoomData) {
            const Expert = ExpertOptions.find(item => item.name === DiscussionRoomData.expertName);
            setExpert(Expert);
        }
    }, [DiscussionRoomData]);

    useEffect(() => {
        conversationRef.current = conversation;
    }, [conversation]);

    // Auto scroll chat to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation, aiLoading]);

    const stopCurrentAudio = () => {
        window.speechSynthesis.cancel();
        if (currentAudio.current) {
            currentAudio.current.pause();
            currentAudio.current.currentTime = 0;
            currentAudio.current = null;
        }
    }

    const connecttoServer = async () => {
        setEnableMic(true);
        isCancelled.current = false;
        isProcessing.current = false;

        try {
            const token = await getToken();
            if (!token) { setEnableMic(false); return; }

            const ws = new WebSocket(`wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&token=${token}`);
            realtimeTranscriber.current = ws;

            ws.onopen = () => console.log('✅ Connected to AssemblyAI Universal Streaming');

            ws.onmessage = async (event) => {
                const msg = JSON.parse(event.data);
                if (msg.type === 'Turn') {
                    stopCurrentAudio();
                    texts.current[msg.turn_order] = msg.transcript;
                    const keys = Object.keys(texts.current).sort((a, b) => a - b);
                    let fullMsg = '';
                    for (const key of keys) {
                        if (texts.current[key]) fullMsg += `${texts.current[key]} `;
                    }
                    setTranscribe(fullMsg.trim());

                    if (msg.end_of_turn && msg.transcript) {
                        clearTimeout(aiCallTimeout.current);
                        aiCallTimeout.current = setTimeout(async () => {
                            if (isCancelled.current) return;
                            const finalText = Object.keys(texts.current).sort((a, b) => a - b).map(k => texts.current[k]).filter(Boolean).join(' ').trim();
                            if (!finalText) return;

                            setConversation(prev => [...prev, { role: 'user', content: finalText }]);
                            setAiLoading(true);
                            try {
                                const aiResp = await AIModel(
                                    DiscussionRoomData?.feelingOption,
                                    DiscussionRoomData?.feeling,
                                    conversationRef.current,
                                    finalText
                                );
                                if (!isCancelled.current) {
                                    const audio = await textToSpeech(aiResp, expert?.name);
                                    currentAudio.current = audio;
                                }
                                setConversation(prev => [...prev, { role: 'assistant', content: aiResp }]);
                            } catch (err) {
                                console.error('AI error:', err);
                            } finally {
                                setAiLoading(false);
                            }
                            setTranscribe('');
                            texts.current = {};
                        }, 1500);
                    }
                }
            };

            ws.onerror = (err) => { console.error('WebSocket error:', err); setEnableMic(false); };
            ws.onclose = (e) => console.log('WebSocket closed:', e.code, e.reason);

            ws.addEventListener('open', async () => {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const RecordRTCModule = (await import('recordrtc')).default;
                recorder.current = new RecordRTCModule(stream, {
                    type: 'audio', mimeType: 'audio/webm',
                    recorderType: RecordRTCModule.StereoAudioRecorder,
                    timeSlice: 250, desiredSampRate: 16000,
                    numberOfAudioChannels: 1, bufferSize: 4096,
                    audioBitsPerSecond: 128000,
                    ondataavailable: async (blob) => {
                        if (!realtimeTranscriber.current || realtimeTranscriber.current.readyState !== WebSocket.OPEN) return;
                        const buffer = await blob.arrayBuffer();
                        realtimeTranscriber.current.send(buffer);
                    },
                });
                recorder.current.startRecording();
            });

        } catch (err) {
            console.error('Connection error:', err);
            setEnableMic(false);
        }
    }

    const disconnect = async (e) => {
        e.preventDefault();
        try {
            isCancelled.current = true;
            isProcessing.current = false;
            setAiLoading(true);
            stopCurrentAudio();
            if (realtimeTranscriber.current) { realtimeTranscriber.current.close(); realtimeTranscriber.current = null; }
            if (recorder.current) { recorder.current.pauseRecording(); recorder.current = null; }
            clearTimeout(aiCallTimeout.current);
            clearTimeout(silenceTimeout.current);
            setEnableMic(false);
            setTranscribe('');
            texts.current = {};
            setTimeout(() => window.speechSynthesis.cancel(), 500);
        } catch (err) {
            console.error('Disconnect error:', err);
        } finally {
            setAiLoading(false);
        }
    }

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif", marginTop: -12 }}>

            {/* Page title */}
            <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7eb89a', marginBottom: 4 }}>
                    Session
                </p>
                <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.6rem', fontWeight: 600, color: '#e8e4dd', margin: 0 }}>
                    {DiscussionRoomData?.feelingOption}
                </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>

                    {/* Left — Avatar panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{
                            height: '60vh',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 28,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Ambient glow behind avatar */}
                            <div style={{
                                position: 'absolute',
                                width: 200, height: 200,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(126,184,154,0.15), transparent 70%)',
                                filter: 'blur(30px)',
                                pointerEvents: 'none',
                            }} />

                            {expert?.avatar ? (
                                <Image
                                    src={expert.avatar}
                                    alt="Avatar"
                                    width={200}
                                    height={200}
                                    style={{
                                        width: 100, height: 100,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid rgba(126,184,154,0.3)',
                                        boxShadow: aiLoading ? '0 0 30px rgba(126,184,154,0.4)' : '0 0 0px transparent',
                                        animation: aiLoading ? 'avatarPulse 1.5s ease-in-out infinite' : 'none',
                                        transition: 'box-shadow 0.3s',
                                        position: 'relative', zIndex: 1,
                                    }}
                                />
                            ) : (
                                <LoaderPinwheel style={{ color: '#7eb89a', animation: 'spin 1s linear infinite' }} />
                            )}

                            <p style={{ color: '#8a8a9a', marginTop: 12, fontSize: '0.9rem', position: 'relative', zIndex: 1 }}>
                                {expert?.name}
                            </p>

                            {aiLoading && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    marginTop: 12, position: 'relative', zIndex: 1,
                                }}>
                                    <LoaderPinwheel size={14} style={{ color: '#7eb89a', animation: 'spin 1s linear infinite' }} />
                                    <p style={{ fontSize: '0.82rem', color: '#7eb89a', margin: 0 }}>Thinking...</p>
                                </div>
                            )}

                            {/* User button bottom right */}
                            <div style={{
                                position: 'absolute', bottom: 20, right: 20,
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 12, padding: '8px 12px',
                            }}>
                                <UserButton />
                            </div>
                        </div>

                        {/* Connect / Disconnect */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {!enableMic ? (
                                <button
                                    onClick={connecttoServer}
                                    style={{
                                        background: '#7eb89a',
                                        color: '#0f1117',
                                        border: 'none',
                                        padding: '12px 36px',
                                        borderRadius: 100,
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        boxShadow: '0 0 24px rgba(126,184,154,0.3)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    Connect
                                </button>
                            ) : (
                                <button
                                    onClick={disconnect}
                                    style={{
                                        background: 'rgba(220,80,80,0.15)',
                                        color: '#e07070',
                                        border: '1px solid rgba(220,80,80,0.3)',
                                        padding: '12px 36px',
                                        borderRadius: 100,
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: '0.95rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    Disconnect
                                </button>
                            )}
                        </div>

                        {/* Live transcribe */}
                        {transcribe && (
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 14,
                                padding: '12px 16px',
                                textAlign: 'center',
                            }}>
                                <p style={{ fontSize: '0.85rem', color: '#8a8a9a', fontStyle: 'italic', margin: 0 }}>
                                    {transcribe}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right — Chat panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{
                            height: '60vh',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 28,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}>
                            {/* Chat header */}
                            <div style={{
                                padding: '16px 20px',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                            }}>
                                <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7eb89a', margin: 0 }}>
                                    Live session
                                </p>
                            </div>

                            {/* Messages */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 10,
                            }}>
                                {conversation.length === 0 && (
                                    <p style={{ fontSize: '0.85rem', color: '#8a8a9a', textAlign: 'center', marginTop: 40 }}>
                                        Your conversation will appear here...
                                    </p>
                                )}

                                {conversation.map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: item.role === 'user' ? 'flex-end' : 'flex-start',
                                    }}>
                                        <p style={{
                                            fontSize: '0.72rem',
                                            color: '#8a8a9a',
                                            marginBottom: 4,
                                            marginLeft: item.role === 'user' ? 0 : 4,
                                            marginRight: item.role === 'user' ? 4 : 0,
                                        }}>
                                            {item.role === 'user' ? 'You' : expert?.name}
                                        </p>
                                        <div style={{
                                            maxWidth: '85%',
                                            padding: '10px 14px',
                                            borderRadius: item.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                            background: item.role === 'user'
                                                ? 'rgba(126,184,154,0.15)'
                                                : 'rgba(255,255,255,0.05)',
                                            border: item.role === 'user'
                                                ? '1px solid rgba(126,184,154,0.2)'
                                                : '1px solid rgba(255,255,255,0.07)',
                                            color: '#e8e4dd',
                                            fontSize: '0.85rem',
                                            lineHeight: 1.55,
                                        }}>
                                            {item.content}
                                        </div>
                                    </div>
                                ))}

                                {/* AI typing indicator */}
                                {aiLoading && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <p style={{ fontSize: '0.72rem', color: '#8a8a9a', marginBottom: 4, marginLeft: 4 }}>
                                            {expert?.name}
                                        </p>
                                        <div style={{
                                            padding: '12px 16px',
                                            borderRadius: '16px 16px 16px 4px',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.07)',
                                            display: 'flex',
                                            gap: 5,
                                            alignItems: 'center',
                                        }}>
                                            {[0, 150, 300].map((delay, i) => (
                                                <div key={i} style={{
                                                    width: 7, height: 7,
                                                    borderRadius: '50%',
                                                    background: '#7eb89a',
                                                    animation: 'dotBounce 1.2s ease-in-out infinite',
                                                    animationDelay: `${delay}ms`,
                                                }} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        </div>

                        <p style={{ fontSize: '0.78rem', color: '#8a8a9a', lineHeight: 1.5, margin: 0 }}>
                            At the end of the session, feedback and key insights will be generated automatically.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes avatarPulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(126,184,154,0.3); }
                    50% { box-shadow: 0 0 40px rgba(126,184,154,0.6); }
                }
                @keyframes dotBounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
                    40% { transform: translateY(-6px); opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default DiscussionRoom;