"use client"
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { ExpertOptions } from '@/services/Options';
import { LoaderPinwheel } from 'lucide-react';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { getToken, AIModel } from '@/services/GlobalServices';

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

    useEffect(() => {
        if (DiscussionRoomData) {
            const Expert = ExpertOptions.find(item => item.name === DiscussionRoomData.expertName);
            setExpert(Expert);
        }
    }, [DiscussionRoomData]);

    const connecttoServer = async () => {
        setEnableMic(true);

        try {
            const token = await getToken();

            if (!token) {
                console.error('No token received!');
                setEnableMic(false);
                return;
            }

            const ws = new WebSocket(
                `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&token=${token}`
            );

            realtimeTranscriber.current = ws;

            ws.onopen = () => {
                console.log('✅ Connected to AssemblyAI Universal Streaming');
            };

            ws.onmessage = async (event) => {
                const msg = JSON.parse(event.data);

                if (msg.type === 'Turn') {
                    // Update partial live preview
                    texts.current[msg.turn_order] = msg.transcript;
                    const keys = Object.keys(texts.current).sort((a, b) => a - b);
                    let fullMsg = '';
                    for (const key of keys) {
                        if (texts.current[key]) {
                            fullMsg += `${texts.current[key]} `;
                        }
                    }
                    setTranscribe(fullMsg.trim());

                    // On final turn, call AI
                    if (msg.end_of_turn && msg.transcript) {
                        // Add user message to conversation
                        const userMessage = { role: 'user', content: msg.transcript };
                        setConversation(prev => [...prev, userMessage]);

                        // Call AI Model
                        // Call AI Model
                        setAiLoading(true);
                        try {
                            const aiResp = await AIModel(
                                DiscussionRoomData?.feeling,        // "I'm feeling..." text
                                DiscussionRoomData?.feelingOption,  // 'Meditation & Mindfulness Exercises' etc.
                                msg.transcript                      // what user just said
                            );
                            console.log('AI Response:', aiResp);

                            setConversation(prev => [...prev, {
                                role: 'assistant',
                                content: aiResp
                            }]);
                        } catch (err) {
                            console.error('AI error:', err);
                        } finally {
                            setAiLoading(false);
                        }
                        setTranscribe('');
                        texts.current = {};
                    }
                }
            };

            ws.onerror = (err) => {
                console.error('WebSocket error:', err);
                setEnableMic(false);
            };

            ws.onclose = (e) => {
                console.log('WebSocket closed:', e.code, e.reason);
            };

            ws.addEventListener('open', async () => {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const RecordRTCModule = (await import('recordrtc')).default;

                recorder.current = new RecordRTCModule(stream, {
                    type: 'audio',
                    mimeType: 'audio/webm',
                    recorderType: RecordRTCModule.StereoAudioRecorder,
                    timeSlice: 250,
                    desiredSampRate: 16000,
                    numberOfAudioChannels: 1,
                    bufferSize: 4096,
                    audioBitsPerSecond: 128000,
                    ondataavailable: async (blob) => {
                        if (!realtimeTranscriber.current ||
                            realtimeTranscriber.current.readyState !== WebSocket.OPEN) return;
                        const buffer = await blob.arrayBuffer();
                        realtimeTranscriber.current.send(buffer);
                    },
                });

                recorder.current.startRecording();
                console.log('🎙️ Recording started');
            });

        } catch (err) {
            console.error('Connection error:', err);
            setEnableMic(false);
        }
    }

    const disconnect = async (e) => {
        e.preventDefault();
        try {
            setAiLoading(true); // show loader — AI is generating final response

            if (realtimeTranscriber.current) {
                realtimeTranscriber.current.close();
                realtimeTranscriber.current = null;
            }
            if (recorder.current) {
                recorder.current.pauseRecording(); // pause not stop, like the video
                recorder.current = null;
            }
            clearTimeout(silenceTimeout.current);
            setEnableMic(false);
            setTranscribe('');
            texts.current = {};

        } catch (err) {
            console.error('Disconnect error:', err);
        } finally {
            setAiLoading(false); // hide loader when done
        }
    }

    return (
        <div className='-mt-12'>
            <h2 className='text-lg font-bold'>{DiscussionRoomData?.feelingOption}</h2>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className='lg:col-span-2'>
                    <div className="lg:col-span-2 h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
                        {expert?.avatar ? (
                            <Image
                                src={expert.avatar}
                                alt="Avatar"
                                width={200}
                                height={200}
                                className={`h-[80px] w-[80px] rounded-full object-cover 
                                    ${aiLoading ? 'animate-pulse' : ''}`}
                            />
                        ) : (
                            <LoaderPinwheel className="animate-spin" />
                        )}
                        <h2 className='text-gray-500 mt-2'>{expert?.name}</h2>

                        {/* AI thinking indicator */}
                        {aiLoading && (
                            <div className='flex items-center gap-2 mt-3'>
                                <LoaderPinwheel className='animate-spin w-4 h-4 text-gray-400' />
                                <p className='text-sm text-gray-400'>Thinking...</p>
                            </div>
                        )}

                        <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
                            <UserButton />
                        </div>
                    </div>

                    {/* Connect/Disconnect button */}
                    <div className='mt-5 flex items-center justify-center'>
                        {!enableMic ? (
                            <Button onClick={connecttoServer}>Connect</Button>
                        ) : (
                            <Button variant="destructive" onClick={disconnect}>Disconnect</Button>
                        )}
                    </div>

                    {/* Partial transcript appears below button */}
                    {transcribe && (
                        <div className='mt-4 p-3 bg-gray-100 rounded-lg text-center'>
                            <p className='text-sm text-gray-500 italic'>{transcribe}</p>
                        </div>
                    )}
                </div>

                <div>
                    <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-start justify-start relative overflow-y-auto p-5">
                        <h2 className='font-bold mb-3'>Chat</h2>
                        {conversation.length > 0 ? (
                            conversation.map((item, i) => (
                                <div key={i} className={`mb-2 p-3 rounded-lg w-full ${item.role === 'user'
                                    ? 'bg-blue-100 text-right'
                                    : 'bg-white text-left'
                                    }`}>
                                    <p className='text-xs text-gray-400 mb-1'>
                                        {item.role === 'user' ? 'You' : expert?.name}
                                    </p>
                                    <p className='text-sm text-gray-700'>{item.content}</p>
                                </div>
                            ))
                        ) : (
                            <p className='text-sm text-gray-400'>Your conversation will appear here...</p>
                        )}

                        {/* AI typing indicator in chat */}
                        {aiLoading && (
                            <div className='mb-2 p-3 bg-white rounded-lg w-full'>
                                <p className='text-xs text-gray-400 mb-1'>{expert?.name}</p>
                                <div className='flex items-center gap-1'>
                                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
                                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
                                    <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <h2 className='mt-4 text-gray-400 text-sm'>
                        At the end of the session, we will automatically generate feedback/notes of the discussion, including key points and actionable insights.
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default DiscussionRoom;