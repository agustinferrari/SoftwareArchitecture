import { RedisClientType } from "redis";
import config from "config";
const Redis = require("redis");

export class RedisContext {
  
  constructor() {
    this.ip = config.get("REDIS.host");
    this.port = config.get("REDIS.port");
    this.redisClient = Redis.createClient({
      url: "redis://" + this.ip + ":" + this.port,
    });
    this.redisClient.connect();
  }
  redisClient: RedisClientType;
  ip: string;
  port: number;

  async set(key: string, value: string): Promise<void> {
    this.redisClient.set(key, value);
  }

  get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }
}
