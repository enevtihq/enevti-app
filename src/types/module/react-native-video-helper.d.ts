declare module 'react-native-video-helper' {
  class ProgressPromise<T> extends Promise<T> {
    progress(handler: () => void): Promise<T>;
  }

  export const compress: (
    source: string,
    options: { startTime?: number; endTime?: number; quality: 'low' | 'medium' | 'high' },
  ) => ProgressPromise<string>;
}
