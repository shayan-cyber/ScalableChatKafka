import Image from "next/image";
import { Inter } from "next/font/google";
import { useSocket } from "@/context/SocketProvider";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { messages, sendMessage } = useSocket();
  const [message, setMessage] = useState("")

  return (
   <>

    <div className="">

      <div className="">
        {messages?.map((message, index)=>{
          return <>
            <div>
              <h1>{message}</h1>
            </div>
          </>
        })}

      </div>


      <div>
        <input type="text" className="text-black" value={message} onChange={(e)=>{
          setMessage(e.target.value)
        }} />
        <button onClick={()=>{
          sendMessage(message)
        }}>Send</button>
      </div>

    </div>
    
   </>
  );
}
