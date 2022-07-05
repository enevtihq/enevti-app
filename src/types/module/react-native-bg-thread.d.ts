declare module 'react-native-bg-thread' {
  /**
   * Javascript executed here runs on the default thread priority which is maximum.
   */
  export const runInBackground: (callback: () => void) => void;
  /**
   * Javascript executed here runs on the passed thread priority.
   */
  export const runInBackground_withPriority: (priority: 'MIN' | 'MAX' | 'NORMAL', callback: () => void) => void;
}
