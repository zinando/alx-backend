const kue = require('kue');

const queue = kue.createQueue();

const job = queue.create('push_notification_code', {
  phoneNumber: '+2317770008881',
  message: 'Liberia Number Format',
}).save((err) => {
  if (!err) {
    console.log(`Notification job created: ${job.id}`);
  }
});

job.on('failed', () => console.log('Notification job failed'));
job.on('complete', () => console.log('Notification job completed'));
