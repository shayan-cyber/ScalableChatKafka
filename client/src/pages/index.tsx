import Image from "next/image";
import { Inter } from "next/font/google";
import { useSocket } from "@/context/SocketProvider";
import { useState } from "react";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter()

  const [room, setRoom] = useState("")
  return (
    <>

      <div className="">

        <div className="flex justify-center items-center h-screen">
          <div className="shadow-lg rounded-lg bg-[#17153B]  w-[600px] p-6">
            <input type="text" className="bg-[#1E1D2E] text-white rounded-lg p-3 w-full" placeholder="Type a room name..." value={room} onChange={(e) => setRoom(e.target.value)} />
            <button className="bg-fuchsia-600 px-8 text-white rounded-lg p-2  block mt-4 w-full" onClick={()=>{
              router.push(`/room/${room}`)
            }}>Join</button>
          </div>

        </div>

      </div>

    </>
  );
}
