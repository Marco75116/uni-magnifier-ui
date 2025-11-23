import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { truncateAddress, getTimeDuration } from '@/lib/helpers/global.helper';
import { InfoTooltip } from './info-tooltip';
import { getTopLiquidityProviders, type LiquidityProviderData } from '@/lib/helpers/queries.helper';

// Mock data for fields not in query (assetsValue, pnl, adjustedPnl)
function getMockDataForWallet(index: number) {
  const variations = [
    { assetsValue: '$12.4M', pnl: '+$234.5K', adjustedPnl: '+$189.2K' },
    { assetsValue: '$8.7M', pnl: '+$156.2K', adjustedPnl: '+$128.5K' },
    { assetsValue: '$6.2M', pnl: '+$42.3K', adjustedPnl: '-$18.7K' },
    { assetsValue: '$5.1M', pnl: '+$98.7K', adjustedPnl: '+$76.4K' },
    { assetsValue: '$4.3M', pnl: '+$187.4K', adjustedPnl: '+$156.8K' },
  ];
  return variations[index % variations.length];
}

interface LPTableProps {
  liquidityProviders: LiquidityProviderData[];
}

function LPTable({ liquidityProviders }: LPTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Wallet</TableHead>
          <TableHead>Assets Value</TableHead>
          <TableHead>Positions</TableHead>
          <TableHead>Unique Pools</TableHead>
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
        {liquidityProviders.map((lp, index) => {
          const mockData = getMockDataForWallet(index);
          // Parse datetime string from ClickHouse (format: "YYYY-MM-DD HH:MM:SS")
          const timeInMarket = getTimeDuration(new Date(lp.first_position_date));

          return (
            <TableRow key={lp.wallet_address} className="cursor-pointer hover:bg-accent">
              <TableCell className="font-mono text-sm">
                <Link href={`/wallet/${lp.wallet_address}`} className="block w-full">
                  {truncateAddress(lp.wallet_address, 6)}
                </Link>
              </TableCell>
              <TableCell className="font-medium">
                <Link href={`/wallet/${lp.wallet_address}`} className="block w-full">
                  {mockData.assetsValue}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/wallet/${lp.wallet_address}`} className="block w-full">
                  {lp.total_positions}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/wallet/${lp.wallet_address}`} className="block w-full">
                  {lp.unique_pools}
                </Link>
              </TableCell>
              <TableCell className={mockData.pnl.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                <Link href={`/wallet/${lp.wallet_address}`} className="block w-full">
                  {mockData.pnl}
                </Link>
              </TableCell>
              <TableCell className={mockData.adjustedPnl.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                <Link href={`/wallet/${lp.wallet_address}`} className="block w-full">
                  {mockData.adjustedPnl}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/wallet/${lp.wallet_address}`} className="block w-full">
                  <Badge variant="outline">{timeInMarket}</Badge>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export async function LPExplorer() {
  // Fetch liquidity providers from ClickHouse
  const liquidityProviders = await getTopLiquidityProviders(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liquidity Providers</CardTitle>
        <CardDescription>
          Learn or copy from successful liquidity providers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LPTable liquidityProviders={liquidityProviders} />
      </CardContent>
    </Card>
  );
}
