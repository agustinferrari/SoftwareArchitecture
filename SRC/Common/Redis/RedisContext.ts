import { RedisClientType } from "redis";
import config from "config";
const Redis = require("redis");

export class RedisContext {
  redisClient: RedisClientType;
  ip: string;
  port: number;
  static instance: RedisContext;

  constructor() {
    this.ip = config.get("REDIS.host");
    this.port = config.get("REDIS.port");
    this.redisClient = Redis.createClient({
      url: "redis://" + this.ip + ":" + this.port,
    });
    this.redisClient.connect();
  }

  public static getInstance(): RedisContext {
    if (!RedisContext.instance) {
      RedisContext.instance = new RedisContext();
    }
    return RedisContext.instance;
  }

  async set(key: string, value: string): Promise<void> {
    this.redisClient.set(key, value);
  }

  get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }
}
