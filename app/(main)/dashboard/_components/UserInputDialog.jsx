"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ExpertOptions } from '@/services/Options'
import Image from 'next/image'
import { useMutation } from 'convex/react'
import { LoaderPinwheel } from 'lucide-react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'

function UserInputDialog({ children, ExpertList }) {
    const [feeling, setFeeling] = useState('');
    const [selectedExpert, setSelectedExpert] = useState('');
    const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const router = useRouter();

    const onClickNext = async () => {
        setLoading(true);
        const result = await createDiscussionRoom({
            feeling: feeling,
            feelingOption: ExpertList?.name,
            expertName: selectedExpert
        });
        setLoading(false);
        setOpenDialog(false);
        router.push('/discussion-room/' + result);
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <div style={{ cursor: 'pointer', width: '100%' }}>{children}</div>
            </DialogTrigger>
            <DialogContent
                className="z-[9999]"
                style={{
                    background: '#141820',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 24,
                    padding: 32,
                    maxWidth: 460,
                    fontFamily: "'DM Sans', sans-serif",
                    color: '#e8e4dd',
                }}
            >
                <DialogHeader>
                    <DialogTitle style={{ fontFamily: "'Lora', serif", fontSize: '1.4rem', fontWeight: 600, color: '#e8e4dd' }}>
                        {ExpertList.name}
                    </DialogTitle>
                </DialogHeader>

                <p style={{ fontSize: '0.88rem', color: '#8a8a9a', lineHeight: 1.6, margin: '8px 0 0' }}>
                    Tell us how you feel and we will start your {ExpertList.name} session right away.
                </p>

                <textarea
                    placeholder="I'm feeling..."
                    onChange={(e) => setFeeling(e.target.value)}
                    rows={3}
                    style={{
                        width: '100%',
                        marginTop: 16,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 14,
                        color: '#e8e4dd',
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: '0.9rem',
                        padding: '14px 16px',
                        resize: 'none',
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                />

                <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a8a9a', margin: '20px 0 12px' }}>
                    Choose your counsellor
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {ExpertOptions.map((expert, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedExpert(expert.name)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 8,
                                padding: '14px 8px',
                                borderRadius: 16,
                                border: selectedExpert === expert.name ? '1px solid #7eb89a' : '1px solid rgba(255,255,255,0.08)',
                                background: selectedExpert === expert.name ? 'rgba(126,184,154,0.1)' : 'rgba(255,255,255,0.03)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: selectedExpert === expert.name ? '0 0 16px rgba(126,184,154,0.15)' : 'none',
                            }}
                        >
                            <Image
                                src={expert.avatar}
                                alt={expert.name}
                                width={64}
                                height={64}
                                style={{ borderRadius: 12, objectFit: 'cover', width: 64, height: 64 }}
                            />
                            <span style={{
                                fontSize: '0.8rem',
                                color: selectedExpert === expert.name ? '#7eb89a' : '#8a8a9a',
                                textAlign: 'center',
                                fontFamily: "'DM Sans', sans-serif",
                            }}>
                                {expert.name}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                    <DialogClose asChild>
                        <button style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#8a8a9a',
                            padding: '10px 20px',
                            borderRadius: 100,
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                        }}>
                            Cancel
                        </button>
                    </DialogClose>
                    <button
                        disabled={!feeling || !selectedExpert || loading}
                        onClick={onClickNext}
                        style={{
                            background: !feeling || !selectedExpert || loading ? 'rgba(126,184,154,0.3)' : '#7eb89a',
                            color: '#0f1117',
                            border: 'none',
                            padding: '10px 24px',
                            borderRadius: 100,
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            cursor: !feeling || !selectedExpert || loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            transition: 'all 0.2s',
                        }}
                    >
                        {loading && <LoaderPinwheel size={14} className="animate-spin" />}
                        Begin session
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UserInputDialog