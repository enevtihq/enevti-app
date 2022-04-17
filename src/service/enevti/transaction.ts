import sleep from 'enevti-app/utils/dummy/sleep';

export async function calculateGasFee(
  transactionPayload: Object,
  signal?: AbortController['signal'],
): Promise<bigint> {
  await sleep(5000, signal);
  return BigInt(12700);
}
