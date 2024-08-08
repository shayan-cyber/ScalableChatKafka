declare namespace NodeJS {
    export interface ProcessEnv {
      // 👇 Replace with your ENV names and types
      NODE_ENV: string;
      KAFKA_BROKER: string;
      KAFKA_USERNAME: string;
      KAFKA_PASSWORD: string;
    }
  }