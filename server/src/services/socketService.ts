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

            socket.on('event:join-room', async ({ room }: { room: string }) => {
                console.log("Joining room : ", room);
                socket.join(room);

            })
            socket.on('event:message', async ({ message , room }: { message: string, room: string }) => {
                console.log("Message received : ", message, " in room : ", room);
                await produceMessage(message, room, "MESSAGES-SOCKET")
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
                        console.log("emitting message : ", message?.value?.toString(), " to room : ", JSON.parse(message?.value?.toString()).room);
                        io.to(JSON.parse(message?.value?.toString()).room).emit('message', JSON.parse(message?.value?.toString()).message);
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