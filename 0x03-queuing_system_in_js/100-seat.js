import { createClient } from 'redis';
import { promisify } from 'util';

const kue = require('kue');
const express = require('express');

const client = createClient();
const getAsync = promisify(client.get).bind(client);
const app = express();
const queue = kue.createQueue();
let reservationEnabled = true;
const PORT = 1245;

client.set('available_seats', 50);
const reserveSeat = (number) => client.set('available_seats', number);
const getCurrentAvailableSeats = async () => {
  try {
    const val = await getAsync('available_seats');
    return val;
  } catch (err) {
    return 0;
  }
};

app.get('/available_seats', async (req, res) => {
  const seats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: seats });
  res.end();
});

app.get('/reserve_seat', async (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    res.end();
    return;
  }
  const job = queue.create('reserve_seat', {});
  job.save((err) => {
    if (err) {
      res.json({ status: 'Reservation failed' });
      res.end();
      return;
    }
    res.json({ status: 'Reservation in process' });
    res.end();
  });
  job.on('complete', () => console.log(`Seat reservation job ${job.id} completed`));
  job.on('failed', (err) => console.log(`Seat reservation job ${job.id} failed: ${err.message}`));
});

app.get('/process', async (req, res) => {
  queue.process('reserve_seat', async (_, done) => {
    const seats = await getCurrentAvailableSeats();
    if (seats === 0) {
      reservationEnabled = false;
      return done();
    }
    if (seats >= 0) {
      reserveSeat(seats - 1);
      return done();
    }
    return done(new Error('Not enough seats available'));
  });
  res.json({ status: 'Queue processing' });
  res.end();
});

app.listen(PORT, () => console.log(`The server is running on port: ${PORT}`));
