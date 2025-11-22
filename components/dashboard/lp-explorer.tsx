import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { truncateAddress } from '@/lib/helpers/global.helper';
import { InfoTooltip } from './info-tooltip';

// Mock data
const mockLPs = [
  {
    id: '1',
    wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    assetsValue: '$12.4M',
    positions: 23,
    activePools: 15,
    pnl: '+$234.5K',
    adjustedPnl: '+$189.2K',
    timeInMarket: '18 months',
    lastActivity: '2 days ago',
  },
  {
    id: '2',
    wallet: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    assetsValue: '$8.7M',
    positions: 18,
    activePools: 12,
    pnl: '+$156.2K',
    adjustedPnl: '+$128.5K',
    timeInMarket: '14 months',
    lastActivity: '5 hours ago',
  },
  {
    id: '3',
    wallet: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    assetsValue: '$6.2M',
    positions: 31,
    activePools: 19,
    pnl: '+$42.3K',
    adjustedPnl: '-$18.7K',
    timeInMarket: '22 months',
    lastActivity: '1 day ago',
  },
  {
    id: '4',
    wallet: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    assetsValue: '$5.1M',
    positions: 14,
    activePools: 9,
    pnl: '+$98.7K',
    adjustedPnl: '+$76.4K',
    timeInMarket: '6 months',
    lastActivity: '3 hours ago',
  },
  {
    id: '5',
    wallet: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    assetsValue: '$4.3M',
    positions: 27,
    activePools: 16,
    pnl: '+$187.4K',
    adjustedPnl: '+$156.8K',
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
          <TableHead>Assets Value</TableHead>
          <TableHead>Positions</TableHead>
          <TableHead>Active Pools</TableHead>
          <TableHead>
            <span className="flex items-center gap-1">
              PnL
              <InfoTooltip content="Assets + Fees" />
            </span>
          </TableHead>
          <TableHead>
            <span className="flex items-center gap-1">
              Adjusted PnL
              <InfoTooltip content="Includes impermanent loss" />
            </span>
          </TableHead>
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
                {lp.assetsValue}
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
            <TableCell className={lp.pnl.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              <Link href={`/wallet/${lp.wallet}`} className="block w-full">
                {lp.pnl}
              </Link>
            </TableCell>
            <TableCell className={lp.adjustedPnl.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              <Link href={`/wallet/${lp.wallet}`} className="block w-full">
                {lp.adjustedPnl}
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
