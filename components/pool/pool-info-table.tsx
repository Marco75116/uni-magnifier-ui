import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { truncateAddress } from '@/lib/helpers/global.helper';

interface PoolInfoTableProps {
  poolId: string;
  currency0: string;
  currency1: string;
  fee: number;
  tickSpacing: number;
  hooks: string;
  sqrtPriceX96: string;
  currentTick: number;
}

export function PoolInfoTable({
  poolId,
  currency0,
  currency1,
  fee,
  tickSpacing,
  hooks,
  sqrtPriceX96,
  currentTick,
}: PoolInfoTableProps) {
  const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <TableRow>
      <TableCell className="font-medium text-muted-foreground">{label}</TableCell>
      <TableCell className="font-mono text-sm">{value}</TableCell>
    </TableRow>
  );

  return (
    <Table>
      <TableBody>
        <InfoRow label="Pool ID" value={truncateAddress(poolId, 8)} />
        <InfoRow label="Currency 0" value={truncateAddress(currency0, 8)} />
        <InfoRow label="Currency 1" value={truncateAddress(currency1, 8)} />
        <InfoRow label="Fee (bps)" value={fee} />
        <InfoRow label="Tick Spacing" value={tickSpacing} />
        <InfoRow label="Hooks" value={truncateAddress(hooks, 8)} />
        <InfoRow label="Current Tick" value={currentTick} />
        <InfoRow label="√Price × 2^96" value={truncateAddress(sqrtPriceX96, 10)} />
      </TableBody>
    </Table>
  );
}
