import { Server } from 'socket.io'
import { produceMessage } from './kafkaService';
import { Consumer } from 'kafkajs';

class SocketService {
    private _io: Server;
    private _consumer: Consumer
    constructor(consumer: Consumer) {
        this._io = new Server({
            cors: {
                origin: "*",
            }

        })
        this._consumer = consumer
    }

    get io() {
        return this._io;
    }

    public async init() {
        const io = this._io;
        io.on('connect', (socket) => {
            socket.on('event:message', async ({ message }: { message: string }) => {
                console.log(message);
                await produceMessage(message, "MESSAGES-SOCKET")


            })
        })
        if (this._consumer) {
            const consumer = this._consumer;
            console.log("Consumer is  running");
            
            await consumer.run({
                autoCommit: true,
                
                eachMessage: async ({ message, pause }) => {
                    console.log(message?.value?.toString());
                    if (!message?.value) {
                        return;
                    }
                    try {
                        console.log("emitting message : ", message?.value?.toString());
                        
                        io.emit('message', message?.value?.toString());
                    } catch (e) {
                        console.log(e, "Something went wrong");
                        pause();
                        setTimeout(() => {
                            consumer.resume([{
                                topic: "MESSAGES-SOCKET",
                            }])
                        }, 60000)
                    }

                }
            })
        }
    }
}

export default SocketService