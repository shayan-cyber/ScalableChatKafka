import React, { useCallback, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

interface SocketProviderProps {
    children?: React.ReactNode;
}
interface ISocketContext {
    messages: string[];
    sendMessage: (message: string) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {

    const [socket, setSocket] = useState<Socket>();
    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage = useCallback((message: string) => {
        if (socket) {
            console.log("sending message", message)
            
            socket.emit('event:message', { message: message })
        }
    }, [socket])
    const onMessageReceived = useCallback((msg: string) => {
        
        setMessages(messages => [...messages, msg]);

    }, [])
    useEffect(() => {

        const _socket = io("http://localhost:8000");
        _socket.on("message", onMessageReceived);
        setSocket(_socket);
        return () => {
            _socket.disconnect();
            _socket.off("message", onMessageReceived);
            setSocket(undefined)
        }


    }, [])
    return <>
        <SocketContext.Provider value={{ messages: messages, sendMessage: sendMessage }}>
            {children}
        </SocketContext.Provider>

    </>;
}

export const useSocket = () =>{
    const state = useContext(SocketContext);
    if(!state){
        throw new Error("useSocket must be used within a SocketContextProvider")

    }
    return state;
}