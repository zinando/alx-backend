import { createClient } from 'redis';

const redis = require('redis');

const client = createClient();

client.on('error', (err) => console.log(`Redis client not connected to the server: ${err.message}`));
client.on('ready', () => console.log('Redis client connected to the server'));

const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, redis.print);
};

const displaySchoolValue = (schoolName) => {
  client.get(schoolName, (error, data) => console.log(data));
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
