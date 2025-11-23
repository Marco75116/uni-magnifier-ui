import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { getValueColorClass, getNetworkName } from '@/lib/helpers/global.helper';
import { TickRangeBar } from '../pool/tick-range-bar';

interface WalletPosition {
  id: string;
  chainId: number;
  poolId: string;
  poolName: string;
  amount0: string;
  symbol0: string;
  amount1: string;
  symbol1: string;
  fees0: string;
  fees1: string;
  tickLower: number;
  tickUpper: number;
  currentTick: number;
  age: string;
  pnl: number;
  pnlAdjusted: number;
  status: 'active' | 'inactive';
}

interface WalletPositionsTableProps {
  positions: WalletPosition[];
}

export function WalletPositionsTable({ positions }: WalletPositionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Chain</TableHead>
          <TableHead>Pool</TableHead>
          <TableHead>Amounts</TableHead>
          <TableHead>Fees</TableHead>
          <TableHead>PnL</TableHead>
          <TableHead>
            <div className="flex items-center gap-1.5">
              <span>PnL Adjusted</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>With Impermanent Loss</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableHead>
          <TableHead className="min-w-[250px]">
            <div className="flex items-center gap-1.5">
              <span>Tick Range</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <span>Current tick position</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Age</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions.map((position) => (
          <TableRow key={position.id} className="hover:bg-accent">
            <TableCell>
              <Badge variant="secondary">{getNetworkName(position.chainId)}</Badge>
            </TableCell>
            <TableCell className="font-medium">
              <Link
                href={`/pool/${position.chainId}/${position.poolId}`}
                className="hover:underline cursor-pointer text-primary"
              >
                {position.poolName}
              </Link>
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex flex-col gap-0.5">
                <span>{position.amount0} {position.symbol0}</span>
                <span>{position.amount1} {position.symbol1}</span>
              </div>
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex flex-col gap-0.5">
                <span>{position.fees0} {position.symbol0}</span>
                <span>{position.fees1} {position.symbol1}</span>
              </div>
            </TableCell>
            <TableCell className={`font-medium ${getValueColorClass(position.pnl)}`}>
              {position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}%
            </TableCell>
            <TableCell className={`font-medium ${getValueColorClass(position.pnlAdjusted)}`}>
              {position.pnlAdjusted >= 0 ? '+' : ''}{position.pnlAdjusted.toFixed(2)}%
            </TableCell>
            <TableCell>
              <TickRangeBar
                tickLower={position.tickLower}
                tickUpper={position.tickUpper}
                currentTick={position.currentTick}
              />
            </TableCell>
            <TableCell>
              <Badge variant={position.status === 'active' ? 'default' : 'secondary'}>
                {position.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {position.age}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
