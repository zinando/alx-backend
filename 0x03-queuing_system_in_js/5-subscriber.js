import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => console.log(`Redis client not connected to the server: ${err.message}`));
client.on('connect', () => console.log('Redis client connected to the server'));

const CHANNEL = 'holberton school channel';

client.subscribe(CHANNEL);

client.on('message', (channel, msg) => {
  console.log(msg);
  if (msg === 'KILL_SERVER') {
    client.unsubscribe(CHANNEL);
  }
});
