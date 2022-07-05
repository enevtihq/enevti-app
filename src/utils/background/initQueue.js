import BackgroundService from 'react-native-background-actions';
import queue, { Worker } from 'react-native-job-queue';
import deliverSecretWorker from 'enevti-app/utils/background/worker/deliverSecretWorker';

queue.configure({
  concurrency: 1,
  onQueueFinish: async () => {
    // TODO: cek kalo masih ada pending, kalo ga ada maka stop, kalo ada maka add worker lagi
    console.log('finished, and killed');
    await BackgroundService.stop();
  },
});

queue.addWorker(
  new Worker('deliverSecret', async payload => {
    return await deliverSecretWorker(payload);
  }),
);
