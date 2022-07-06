import RnBgTask from 'react-native-bg-thread';

export default function runInBackground(callback: () => Promise<void>) {
  return new Promise<void>((resolve, reject) => {
    RnBgTask.runInBackground(async () => {
      try {
        await callback();
        resolve();
      } catch {
        reject();
      }
    });
  });
}
