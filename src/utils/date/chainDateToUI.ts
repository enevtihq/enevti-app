/* Convert seconds-based date in bigint / number, to miliseconds-based in number for UI consumption */
export default function chainDateToUI(date: bigint | number): number {
  return Number(BigInt(date) * BigInt(1000));
}
