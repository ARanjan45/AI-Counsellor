import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { ExpertOptions } from '@/services/Options'
import Image from 'next/image'
import { useStackApp } from '@stackframe/stack'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { LoaderPinwheel } from 'lucide-react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
function UserInputDialog({ children, ExpertList }) {
    const[feeling,setFeeling]=useState();
    const [selectedExpert, setSelectedExpert] = useState();
    const createDiscussionRoom=useMutation(api.DiscussionRoom.CreateNewRoom);
    const [loading,setLoading]=useState(false);
    const [openDialog,setOpenDialog]=useState(false)
    const router=useRouter()
    const onClickNext=async()=>{
        setLoading(true);
        const result=await createDiscussionRoom({
            feeling:feeling,
            feelingOption:ExpertList?.name,
            expertName:selectedExpert
        })
        console.log(result);
        setLoading(false);
        setOpenDialog(false);
        router.push('/discussion-room/' + result);
    }
    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{ExpertList.name}</DialogTitle>
                    <DialogDescription asChild>
                        <div className='mt-3'>
                            <h2>
                                Tell us how you feel and we will start the {ExpertList.name} session for you straight away!
                            </h2>
                            <Textarea placeholder="I'm feeling..." className='mt-4' onChange={(e) => setFeeling(e.target.value)} />
                            <h2 className='mt-5'>Choose an expert to connect with</h2>
                            <div className='grid grid-cols-3 md:grid-cols-3 gap-6 mt-3'>
                                {ExpertOptions.map((expert, index) => (
                                    <div key={index} onClick={() => setSelectedExpert(expert.name)} className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer border ${selectedExpert === expert.name ? 'border-blue-500' : 'border-gray-300'}`}>
                                        <Image src={expert.avatar} alt={expert.name} width={100} height={100} className={`rounded-2xl h-[80px] w-[80px] object-covered inline-block hover:scale-105 transition-all cursor-pointer`} />
                                        <h2 className='text-center'>{expert.name}</h2>
                                    </div>

                                ))}
                            </div>
                            <div className='flex gap-5 justify-end mt-5'>
                            <DialogClose asChild>
                                <Button variant={'ghost'}>Cancel</Button>
                            </DialogClose>
                                <Button disabled={(!feeling || !selectedExpert || loading)} onClick={onClickNext}>
                                    {loading&&<LoaderPinwheel className='animate-spin'/>}
                                    Next</Button>
                            </div>

                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default UserInputDialog