import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { getTopPools, type PoolData } from '@/lib/helpers/queries.helper';
import { formatPoolName, formatFeeTier, getNetworkName } from '@/lib/helpers/global.helper';

interface PoolTableProps {
  pools: PoolData[];
}

function PoolTable({ pools }: PoolTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pool</TableHead>
          <TableHead>TVL</TableHead>
          <TableHead>24h Volume</TableHead>
          <TableHead>7d Volume</TableHead>
          <TableHead>Fee Tier</TableHead>
          <TableHead>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center gap-1">
                  APR
                  <Info className="h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>APR for full range position</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TableHead>
          <TableHead>Chain</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools.map((pool) => (
          <TableRow key={pool.pool_id} className="cursor-pointer hover:bg-accent">
            <TableCell className="font-medium">
              <Link href={`/pool/${pool.pool_id}`} className="block w-full">
                {formatPoolName(pool.currency0, pool.currency1, pool.chainId)}
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/pool/${pool.pool_id}`} className="block w-full">
                $125.4M
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/pool/${pool.pool_id}`} className="block w-full">
                $45.2M
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/pool/${pool.pool_id}`} className="block w-full">
                $312.8M
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/pool/${pool.pool_id}`} className="block w-full">
                <Badge variant="outline">{formatFeeTier(pool.fee)}</Badge>
              </Link>
            </TableCell>
            <TableCell className="text-green-600 dark:text-green-400">
              <Link href={`/pool/${pool.pool_id}`} className="block w-full">
                12.4%
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/pool/${pool.pool_id}`} className="block w-full">
                <Badge variant="secondary">{getNetworkName(pool.chainId)}</Badge>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export async function PoolExplorer() {
  const pools = await getTopPools(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pools</CardTitle>
        <CardDescription>
          Discover the best liquidity pools for your strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PoolTable pools={pools} />
      </CardContent>
    </Card>
  );
}
