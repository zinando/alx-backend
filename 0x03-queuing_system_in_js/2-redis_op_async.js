import { createClient } from 'redis';

const { promisify } = require('util');

const client = createClient();

client.on('error', (err) => console.log(`Redis client not connected to the server: ${err.message}`));
client.on('ready', () => console.log('Redis client connected to the server'));

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

const setNewSchool = async (schoolName, value) => {
  try {
    const reply = await setAsync(schoolName, value);
    console.log('Reply:', reply);
  } catch (err) {
    client.quit();
  }
};

const displaySchoolValue = async (schoolName) => {
  try {
    const val = await getAsync(schoolName);
    console.log(val);
  } catch (err) {
    client.quit();
  }
};

displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
