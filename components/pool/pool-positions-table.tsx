import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { truncateAddress, getValueColorClass } from '@/lib/helpers/global.helper';
import { TickRangeBar } from './tick-range-bar';

interface Position {
  id: string;
  owner: string;
  amount0: string;
  symbol0: string;
  amount1: string;
  symbol1: string;
  tickLower: number;
  tickUpper: number;
  age: string;
  pnl: number;
  pnlAdjusted: number;
  status: 'active' | 'inactive';
}

interface PoolPositionsTableProps {
  positions: Position[];
  currentTick: number;
}

export function PoolPositionsTable({ positions, currentTick }: PoolPositionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Owner</TableHead>
          <TableHead>Amounts</TableHead>
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
                      <span>Current tick: {currentTick.toLocaleString()}</span>
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
            <TableCell className="font-mono text-sm">
              <Link
                href={`/wallet/${position.owner}`}
                className="hover:underline cursor-pointer text-primary"
              >
                {truncateAddress(position.owner, 6)}
              </Link>
            </TableCell>
            <TableCell className="font-medium">
              <div className="flex flex-col gap-0.5">
                <span>{position.amount0} {position.symbol0}</span>
                <span>{position.amount1} {position.symbol1}</span>
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
                currentTick={currentTick}
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
