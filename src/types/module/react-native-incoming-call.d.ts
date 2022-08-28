declare module '@bob.hardcoder/react-native-incoming-call' {
  export const getExtrasFromHeadlessMode: () => Promise<any>;
  export const dismiss: () => void;
  export const openAppFromHeadlessMode: (uuid: string) => void;
  export const backToForeground: () => void;
  export const display: (uuid: string, username: string, url: string, infoText: string, timeout: number) => void;
}
