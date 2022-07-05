import RnBgTask from 'react-native-bg-thread';

export default function runInBackground(callback: () => Promise<void>) {
  return new Promise<void>(resolve => {
    RnBgTask.runInBackground(async () => {
      await callback();
      resolve();
    });
  });
}
