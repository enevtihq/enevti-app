declare module 'ipfs-only-hash' {
  export function of(input: string | Buffer | Uint8Array, options?: Record<string, any>): Promise<string>;
}
