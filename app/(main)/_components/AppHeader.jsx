import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import React from 'react'

function AppHeader() {
  return (
    <div className='p-2 shadow-sm flex items-center justify-between'>
        <Image src="/logo.svg" alt="Logo" width={130} height={150} />
        <UserButton/>
    </div>
  )
}

export default AppHeader