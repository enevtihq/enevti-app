/* global BigInt */
export default async function calculateFee(
  transactionPayload: string,
): Promise<bigint> {
  const asset = JSON.parse(transactionPayload);
  return BigInt(12700);
}
