const kue = require('kue');

const queue = kue.createQueue();
const sendNotification = (phoneNumber, message) => {
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

queue.process('push_notification_code', 10, (job) => sendNotification(job.data.phoneNumber, job.data.message));
