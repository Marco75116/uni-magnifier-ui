import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

// Mock data
const mockPools = [
  {
    id: '1',
    pool: 'USDC/ETH',
    tvl: '$125.4M',
    volume24h: '$45.2M',
    volume7d: '$312.8M',
    feeTier: '0.05%',
    apr: '12.4%',
    chain: 'Ethereum',
  },
  {
    id: '2',
    pool: 'WETH/USDT',
    tvl: '$98.7M',
    volume24h: '$38.1M',
    volume7d: '$267.3M',
    feeTier: '0.30%',
    apr: '15.2%',
    chain: 'Arbitrum',
  },
  {
    id: '3',
    pool: 'USDC/USDT',
    tvl: '$87.2M',
    volume24h: '$52.3M',
    volume7d: '$401.2M',
    feeTier: '0.01%',
    apr: '8.9%',
    chain: 'Ethereum',
  },
  {
    id: '4',
    pool: 'DAI/USDC',
    tvl: '$76.5M',
    volume24h: '$28.7M',
    volume7d: '$198.4M',
    feeTier: '0.01%',
    apr: '7.3%',
    chain: 'Base',
  },
  {
    id: '5',
    pool: 'WBTC/ETH',
    tvl: '$65.3M',
    volume24h: '$22.1M',
    volume7d: '$156.7M',
    feeTier: '0.30%',
    apr: '11.8%',
    chain: 'Ethereum',
  },
];

function PoolTable() {
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
        {mockPools.map((pool) => (
          <TableRow key={pool.id} className="cursor-pointer hover:bg-accent">
            <TableCell className="font-medium">
              <Link href={`/pool/${pool.id}`} className="block w-full">
                {pool.pool}
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/pool/${pool.id}`} className="block w-full">
                {pool.tvl}
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/pool/${pool.id}`} className="block w-full">
                {pool.volume24h}
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/pool/${pool.id}`} className="block w-full">
                {pool.volume7d}
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/pool/${pool.id}`} className="block w-full">
                <Badge variant="outline">{pool.feeTier}</Badge>
              </Link>
            </TableCell>
            <TableCell className="text-green-600 dark:text-green-400">
              <Link href={`/pool/${pool.id}`} className="block w-full">
                {pool.apr}
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/pool/${pool.id}`} className="block w-full">
                <Badge variant="secondary">{pool.chain}</Badge>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function PoolExplorer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pools</CardTitle>
        <CardDescription>
          Discover the best liquidity pools for your strategy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PoolTable />
      </CardContent>
    </Card>
  );
}
