import http from 'http';
import { startMessageConsumer } from './services/kafkaService';
import SocketService from './services/socketService';
import dotenv from 'dotenv';
dotenv.config();


async function init() {
    const consumer = await startMessageConsumer("MESSAGES-SOCKET");
    const httpServer = http.createServer();
    const PORT = 8000;
    const socketService = new SocketService(consumer);
    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
    socketService.init();
}

init();
