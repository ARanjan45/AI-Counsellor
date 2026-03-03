"use client"
import React from 'react'
import { useUser } from '@stackframe/stack'
import { Button } from '@/components/ui/button';
import { ExpertList } from '@/services/Options';
import Image from 'next/image';
import { BlurFade } from "@/components/ui/blur-fade"
function FeatureAssistant() {
    const user = useUser();
    return (
        <div>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-medium text-gray-500'>
                        My Workspace
                    </h2>
                    <h2 className='text-3xl font-bold'>Welcome back, {user?.displayName || 'Guest'}!</h2>

                </div>
                <Button>
                    Profile
                </Button>
            </div>
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 px-6 py-8'>
                {ExpertList.map((option, index) => (
                    <BlurFade key={index} delay={0.25 + index * 0.05} inView>
                        <div className='group relative flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-secondary border border-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden'>

                            {/* Subtle glow on hover */}
                            <div className='absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl' />

                            {/* Image */}
                            <Image
                                src={option.icon}
                                alt={option.name}
                                width={100}
                                height={100}
                                className='relative z-10 object-contain group-hover:scale-110 transition-transform duration-300'
                            />

                            {/* Name */}
                            <h2 className='relative z-10 text-sm font-semibold text-gray-700 group-hover:text-indigo-700 text-center leading-tight transition-colors duration-300'>
                                {option.name}
                            </h2>

                            {/* Bottom accent bar */}
                            <div className='absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-[2px] bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-300' />
                        </div>
                    </BlurFade>
                ))}
            </div>
        </div>

    )
}

export default FeatureAssistant