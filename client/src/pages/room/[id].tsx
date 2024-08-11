import React from 'react'
import { useRouter } from 'next/router'
import { useSocket } from '../../context/SocketProvider'
import { useEffect, useState } from 'react'
function Page() {
    const router = useRouter()
    const { id } = router.query
    const { messages, sendMessage, joinRoom } = useSocket()
    const [message, setMessage] = useState('')
    useEffect(() => {
        if (!id) {
            return
        }
        joinRoom(id as string)
    }, [id])

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className='shadow-lg rounded-lg p-4 bg-[#17153B] w-[600px]'>
                <h1 className='text-2xl font-bold text-white text-center'>Room {id}</h1>

                <div className='border-2 rounded-lg border-slate-400 p-4 overflow-y-auto max-h-[60vh] mt-4'>
                    {messages.map((message, index) => (
                        <div className='p-2 rounded-2xl shadow-md bg-[#2E236C] px-4 text-white my-2'>
                            <p key={index} className='text-white'>{message}</p>
                        </div>
                    ))}

                </div>

                <div className='flex justify-center items-center mt-4'>
                    <input className='bg-[#1E1D2E] text-white rounded-lg p-3 w-full' placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button className='bg-fuchsia-600 px-8 text-white rounded-lg p-2 ml-2' onClick={() => {
                        
                        sendMessage(message, id as string)
                        setMessage('')
                    }}>Send</button>

                </div>

            </div>

        </div>
    )
}

export default Page

