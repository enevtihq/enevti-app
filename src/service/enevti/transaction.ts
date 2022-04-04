/* eslint-disable @typescript-eslint/no-unused-vars */
export async function calculateGasFee(
  transactionPayload: Object,
  signal?: AbortController['signal'],
): Promise<bigint> {
  return BigInt(12700);
}
