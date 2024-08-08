import { Kafka, Producer } from "kafkajs";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();



const kafka = new Kafka({
    brokers: [process?.env?.KAFKA_BROKER || ""],
    ssl: {
        ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
    },
    sasl: {
        username: process?.env?.KAFKA_USERNAME || "",
        password: process?.env?.KAFKA_PASSWORD || "",
        mechanism: 'plain',
    }
})

let producer: Producer | null = null;

export const createProducer = async () => {
    if (producer) {
        return producer;
    }
    const _producer = kafka.producer();
    await _producer.connect();
    producer = _producer;
    return producer;
}

export const produceMessage = async (message: string, topic: string) => {
    const _producer = await createProducer();
    await _producer?.send({
        messages: [{ key: `message-${Date.now()}`, value: message }],
        topic: topic,
    })
    return true;
}

export const startMessageConsumer = async (topic: string) => {
    const _consumer = kafka.consumer({
        groupId: "default"
    });
    await _consumer.connect();
    await _consumer.subscribe({
        topic: topic,
        fromBeginning: true
    })
    return _consumer;

}