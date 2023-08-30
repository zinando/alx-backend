const kue = require('kue');

const queue = kue.createQueue();
const blacklist = ['4153518780', '4153518781'];
const sendNotification = (phoneNumber, message, job, done) => {
  if (phoneNumber === blacklist[0] || phoneNumber === blacklist[1]) {
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }
  job.on('progress', (progress) => {
    if (progress <= 50) {
      console.log(`Notification job #${job.id} ${progress}% complete`);
    }
  });
  job.on('complete', () => console.log(`Notification job #${job.id} completed`));
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  return done();
};

queue.process('push_notification_code_2', 2, (job, done) => sendNotification(job.data.phoneNumber, job.data.message, job, done));
