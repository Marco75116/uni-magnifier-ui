import { generateMetadata } from '@/lib/metadata';
import { truncateAddress, formatPoolName, getRelativeTime } from '@/lib/helpers/global.helper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletStatsCards } from '@/components/wallet/wallet-stats-cards';
import { WalletPositionsTableWrapper } from '@/components/wallet/wallet-positions-table-wrapper';
import { CopyAddressButton } from '@/components/wallet/copy-address-button';
import { getWalletTotalPositions, getWalletPositions, getWalletPositionsLast30Days } from '@/lib/helpers/queries.helper';
import { ClickHouseService } from '@/lib/services/clickhouse.service';

export const metadata = generateMetadata({
  title: 'Wallet Details',
  description: 'Wallet analytics and positions',
});

interface PageProps {
  params: Promise<{ address: string }>;
}

// Helper to get pool data for current tick
async function getPoolData(poolId: string, chainId: number) {
  const query = `
    SELECT tick, currency0, currency1
    FROM pools
    WHERE pool_id = '${poolId.toLowerCase()}' AND chainId = ${chainId} AND sign = 1
    LIMIT 1
  `;
  const result = await ClickHouseService.queryWithParams<{
    tick: number;
    currency0: string;
    currency1: string;
  }>(query);
  return result[0];
}

export default async function WalletPage({ params }: PageProps) {
  const { address } = await params;

  // Fetch real data from ClickHouse
  const totalPositionsCount = await getWalletTotalPositions(address);
  const walletPositions = await getWalletPositions(address, 10);
  const positionsLast30Days = await getWalletPositionsLast30Days(address);

  // Mock data for fields not in query (amounts, fees, pnl)
  const mockDataVariations = [
    { amount0: '542,000', symbol0: 'USDC', amount1: '156.8', symbol1: 'ETH', fees0: '1,245', fees1: '0.36', pnl: 12.45, pnlAdjusted: 8.32 },
    { amount0: '428,500', symbol0: 'USDC', amount1: '124.2', symbol1: 'ETH', fees0: '985', fees1: '0.28', pnl: 8.76, pnlAdjusted: 5.42 },
    { amount0: '312,800', symbol0: 'USDC', amount1: '90.6', symbol1: 'ETH', fees0: '756', fees1: '0.22', pnl: -3.21, pnlAdjusted: -5.87 },
    { amount0: '789,200', symbol0: 'USDC', amount1: '228.5', symbol1: 'ETH', fees0: '1,876', fees1: '0.54', pnl: 15.32, pnlAdjusted: 11.98 },
    { amount0: '234,600', symbol0: 'USDC', amount1: '68.0', symbol1: 'ETH', fees0: '543', fees1: '0.16', pnl: 6.54, pnlAdjusted: 3.21 },
    { amount0: '156,300', symbol0: 'USDC', amount1: '45.3', symbol1: 'ETH', fees0: '378', fees1: '0.11', pnl: -2.45, pnlAdjusted: -4.12 },
    { amount0: '623,400', symbol0: 'USDC', amount1: '180.6', symbol1: 'ETH', fees0: '1,456', fees1: '0.42', pnl: 9.87, pnlAdjusted: 7.23 },
    { amount0: '345,700', symbol0: 'USDC', amount1: '100.2', symbol1: 'ETH', fees0: '823', fees1: '0.24', pnl: 4.32, pnlAdjusted: 2.01 },
    { amount0: '567,800', symbol0: 'USDC', amount1: '164.5', symbol1: 'ETH', fees0: '1,321', fees1: '0.38', pnl: -7.65, pnlAdjusted: -10.23 },
    { amount0: '892,300', symbol0: 'USDC', amount1: '258.6', symbol1: 'ETH', fees0: '2,087', fees1: '0.60', pnl: 18.92, pnlAdjusted: 15.67 },
  ];

  // Map real positions data from ClickHouse
  const rawPositions = await Promise.all(
    walletPositions.map(async (pos, index) => {
      // Fetch pool data to get current tick and currencies
      const poolData = await getPoolData(pos.pool_id, pos.chainId);
      const mockData = mockDataVariations[index % mockDataVariations.length];

      return {
        id: pos.position_id,
        chainId: pos.chainId,
        poolId: pos.pool_id,
        poolName: poolData ? formatPoolName(poolData.currency0, poolData.currency1, pos.chainId) : 'Unknown',
        amount0: mockData.amount0,
        symbol0: mockData.symbol0,
        amount1: mockData.amount1,
        symbol1: mockData.symbol1,
        fees0: mockData.fees0,
        fees1: mockData.fees1,
        age: getRelativeTime(
          // Check if timestamp is already in milliseconds (> year 2100 in seconds)
          pos.creation_timestamp > 4102444800
            ? new Date(pos.creation_timestamp)
            : new Date(pos.creation_timestamp * 1000)
        ),
        pnl: mockData.pnl,
        pnlAdjusted: mockData.pnlAdjusted,
        tickLower: pos.tick_lower,
        tickUpper: pos.tick_upper,
        currentTick: poolData?.tick || 0,
      };
    })
  );

  // Compute status based on whether current tick is in range
  const positions = rawPositions.map((pos) => {
    const isInRange = pos.currentTick >= pos.tickLower && pos.currentTick <= pos.tickUpper;
    return {
      ...pos,
      status: isInRange ? ('active' as const) : ('inactive' as const),
    };
  });

  // Calculate wallet stats
  const activePositionsCount = positions.filter((p) => p.status === 'active').length;
  const totalPortfolioValue = positions.reduce((acc, pos) => {
    // Simple estimation: convert amounts to USD (assuming USDC = $1)
    const value = parseFloat(pos.amount0.replace(/,/g, ''));
    return acc + value;
  }, 0);

  const totalUnrealizedPnL = positions.reduce((acc, pos) => {
    const value = parseFloat(pos.amount0.replace(/,/g, ''));
    const pnlValue = (value * pos.pnlAdjusted) / 100;
    return acc + pnlValue;
  }, 0);

  const mockWalletData = {
    totalValue: `$${(totalPortfolioValue / 1000000).toFixed(2)}M`,
    totalValueChange: '+3.2%',
    activePositions: activePositionsCount,
    totalPositions: totalPositionsCount, // Use real count from ClickHouse
    totalFees: '$18,432.56',
    totalFeesChange: '+$342.18',
    realizedPnL: '+$24,567.89',
    realizedPnLChange: 'text-green-600 dark:text-green-400',
    unrealizedPnL: totalUnrealizedPnL >= 0 ? `+$${totalUnrealizedPnL.toFixed(2)}` : `-$${Math.abs(totalUnrealizedPnL).toFixed(2)}`,
    unrealizedPnLChangeClass:
      totalUnrealizedPnL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
    positionsLastMonth: positionsLast30Days, // Use real count from ClickHouse
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Wallet Details</h1>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground font-mono">{truncateAddress(address, 10)}</p>
          <CopyAddressButton address={address} />
        </div>
      </div>

      {/* Stats Cards */}
      <WalletStatsCards
        totalValue={mockWalletData.totalValue}
        totalValueChange={mockWalletData.totalValueChange}
        activePositions={mockWalletData.activePositions}
        totalPositions={mockWalletData.totalPositions}
        totalFees={mockWalletData.totalFees}
        totalFeesChange={mockWalletData.totalFeesChange}
        realizedPnL={mockWalletData.realizedPnL}
        realizedPnLChange={mockWalletData.realizedPnLChange}
        unrealizedPnL={mockWalletData.unrealizedPnL}
        unrealizedPnLChangeClass={mockWalletData.unrealizedPnLChangeClass}
        positionsLastMonth={mockWalletData.positionsLastMonth}
      />

      {/* Positions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
          <CardDescription>
            Showing {Math.min(10, totalPositionsCount)} of {totalPositionsCount} positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WalletPositionsTableWrapper positions={positions} totalPositions={totalPositionsCount} />
        </CardContent>
      </Card>
    </div>
  );
}
