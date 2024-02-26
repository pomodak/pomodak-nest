import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { validateConfig } from '../utils/validate-config';
import { RedisEnvironmentVariablesValidator } from './redis-config';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const validatedEnv = validateConfig(
      process.env,
      RedisEnvironmentVariablesValidator,
    );

    const pubClient = createClient({
      url: `redis://${validatedEnv.REDIS_HOST}:${validatedEnv.REDIS_PORT}`,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: [
          'https://monta-pwa.vercel.app',
          'http://localhost:5173',
          'http://192.168.1.208:5173',
        ],
        credentials: true,
        allowedHeaders: ['Authorization', 'Content-Type'],
      },
    });
    server.adapter(this.adapterConstructor);
    return server;
  }
}