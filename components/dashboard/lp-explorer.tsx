import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { truncateAddress } from '@/lib/helpers/global.helper';

// Mock data
const mockLPs = [
  {
    id: '1',
    wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    totalTVL: '$12.4M',
    positions: 23,
    activePools: 15,
    unrealizedPnL: '+$234.5K',
    timeInMarket: '18 months',
    lastActivity: '2 days ago',
  },
  {
    id: '2',
    wallet: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    totalTVL: '$8.7M',
    positions: 18,
    activePools: 12,
    unrealizedPnL: '+$156.2K',
    timeInMarket: '14 months',
    lastActivity: '5 hours ago',
  },
  {
    id: '3',
    wallet: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    totalTVL: '$6.2M',
    positions: 31,
    activePools: 19,
    unrealizedPnL: '-$42.3K',
    timeInMarket: '22 months',
    lastActivity: '1 day ago',
  },
  {
    id: '4',
    wallet: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    totalTVL: '$5.1M',
    positions: 14,
    activePools: 9,
    unrealizedPnL: '+$98.7K',
    timeInMarket: '6 months',
    lastActivity: '3 hours ago',
  },
  {
    id: '5',
    wallet: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    totalTVL: '$4.3M',
    positions: 27,
    activePools: 16,
    unrealizedPnL: '+$187.4K',
    timeInMarket: '12 months',
    lastActivity: '6 days ago',
  },
];

function LPTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Wallet</TableHead>
          <TableHead>Total TVL</TableHead>
          <TableHead>Positions</TableHead>
          <TableHead>Active Pools</TableHead>
          <TableHead>Unrealized P&L</TableHead>
          <TableHead>Time in Market</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockLPs.map((lp) => (
          <TableRow key={lp.id} className="cursor-pointer hover:bg-accent">
            <TableCell className="font-mono text-sm">
              <Link href={`/wallet/${lp.wallet}`} className="block w-full">
                {truncateAddress(lp.wallet, 6)}
              </Link>
            </TableCell>
            <TableCell className="font-medium">
              <Link href={`/wallet/${lp.wallet}`} className="block w-full">
                {lp.totalTVL}
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/wallet/${lp.wallet}`} className="block w-full">
                {lp.positions}
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/wallet/${lp.wallet}`} className="block w-full">
                {lp.activePools}
              </Link>
            </TableCell>
            <TableCell className={lp.unrealizedPnL.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              <Link href={`/wallet/${lp.wallet}`} className="block w-full">
                {lp.unrealizedPnL}
              </Link>
            </TableCell>
            <TableCell>
              <Link href={`/wallet/${lp.wallet}`} className="block w-full">
                <Badge variant="outline">{lp.timeInMarket}</Badge>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function LPExplorer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liquidity Providers</CardTitle>
        <CardDescription>
          Learn or copy from successful liquidity providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LPTable />
      </CardContent>
    </Card>
  );
}
