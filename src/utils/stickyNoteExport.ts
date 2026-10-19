export function formatNumberId(val: number): string {
  return (val || 0).toLocaleString('id-ID');
}

export function formatRupiah(amount: number): string {
  const isNegative = amount < 0;
  const absVal = Math.abs(amount || 0);
  return `${isNegative ? '- ' : ''}Rp ${absVal.toLocaleString('id-ID')}`;
}
