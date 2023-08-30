import { createClient } from 'redis';

const redis = require('redis');

const client = createClient();

client.on('error', (err) => console.log(`Redis client not connected to the server: ${err.message}`));
client.on('ready', () => console.log('Redis client connected to the server'));
const HASH = 'HolbertonSchools';

client.hset(HASH, 'Portland', '50', redis.print);
client.hset(HASH, 'Seattle', '80', redis.print);
client.hset(HASH, 'New York', '20', redis.print);
client.hset(HASH, 'Bogota', '20', redis.print);
client.hset(HASH, 'Cali', '40', redis.print);
client.hset(HASH, 'Paris', '2', redis.print);

client.hgetall(HASH, (err, data) => console.log(data));
