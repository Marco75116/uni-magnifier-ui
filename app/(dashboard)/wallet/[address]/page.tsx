import { generateMetadata } from '@/lib/metadata';
import { truncateAddress } from '@/lib/helpers/global.helper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletStatsCards } from '@/components/wallet/wallet-stats-cards';
import { WalletPositionsTableWrapper } from '@/components/wallet/wallet-positions-table-wrapper';
import { CopyAddressButton } from '@/components/wallet/copy-address-button';
import { getWalletTotalPositions } from '@/lib/helpers/queries.helper';

export const metadata = generateMetadata({
  title: 'Wallet Details',
  description: 'Wallet analytics and positions',
});

interface PageProps {
  params: Promise<{ address: string }>;
}

export default async function WalletPage({ params }: PageProps) {
  const { address } = await params;

  // Fetch real total positions count from ClickHouse
  const totalPositionsCount = await getWalletTotalPositions(address);

  // Mock data - will be replaced with real data from ClickHouse
  const rawPositions = [
    {
      id: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      chainId: 1,
      poolId: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
      poolName: 'USDC/ETH',
      amount0: '542,000',
      symbol0: 'USDC',
      amount1: '156.8',
      symbol1: 'ETH',
      fees0: '1,245',
      fees1: '0.36',
      age: '3 days',
      pnl: 12.45,
      pnlAdjusted: 8.32,
      tickLower: -887220,
      tickUpper: 887220,
      currentTick: -276324,
    },
    {
      id: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      chainId: 8453,
      poolId: '0x4c36388be6f416a29c8d8eee81c771ce6be14b18',
      poolName: 'USDC/ETH',
      amount0: '428,500',
      symbol0: 'USDC',
      amount1: '124.2',
      symbol1: 'ETH',
      fees0: '985',
      fees1: '0.28',
      age: '5 days',
      pnl: 8.76,
      pnlAdjusted: 5.21,
      tickLower: -276400,
      tickUpper: -276200,
      currentTick: -276324,
    },
    {
      id: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      chainId: 1,
      poolId: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
      poolName: 'USDC/ETH',
      amount0: '327,100',
      symbol0: 'USDC',
      amount1: '94.8',
      symbol1: 'ETH',
      fees0: '752',
      fees1: '0.22',
      age: '1 week',
      pnl: -2.34,
      pnlAdjusted: -4.12,
      tickLower: -276500,
      tickUpper: -276100,
      currentTick: -276324,
    },
    {
      id: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
      chainId: 10,
      poolId: '0x85149247691df622eaf1a8bd0cafd40bc45154a9',
      poolName: 'USDC/ETH',
      amount0: '271,500',
      symbol0: 'USDC',
      amount1: '78.7',
      symbol1: 'ETH',
      fees0: '1,865',
      fees1: '0.54',
      age: '2 weeks',
      pnl: 15.89,
      pnlAdjusted: 11.45,
      tickLower: -400000,
      tickUpper: -150000,
      currentTick: -276324,
    },
    {
      id: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      chainId: 8453,
      poolId: '0x4c36388be6f416a29c8d8eee81c771ce6be14b18',
      poolName: 'USDC/ETH',
      amount0: '216,000',
      symbol0: 'USDC',
      amount1: '62.6',
      symbol1: 'ETH',
      fees0: '156',
      fees1: '0.05',
      age: '18 hours',
      pnl: 3.21,
      pnlAdjusted: 2.87,
      tickLower: -100000,
      tickUpper: 100000,
      currentTick: -276324,
    },
    {
      id: '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
      chainId: 42161,
      poolId: '0xc31e54c7a869b9fcbecc14363cf510d1c41fa443',
      poolName: 'USDC/ETH',
      amount0: '160,500',
      symbol0: 'USDC',
      amount1: '46.5',
      symbol1: 'ETH',
      fees0: '1,125',
      fees1: '0.33',
      age: '3 weeks',
      pnl: -5.67,
      pnlAdjusted: -8.23,
      tickLower: 200000,
      tickUpper: 450000,
      currentTick: -276324,
    },
    {
      id: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
      chainId: 1,
      poolId: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
      poolName: 'USDC/ETH',
      amount0: '143,500',
      symbol0: 'USDC',
      amount1: '41.6',
      symbol1: 'ETH',
      fees0: '654',
      fees1: '0.19',
      age: '6 days',
      pnl: 9.12,
      pnlAdjusted: 6.34,
      tickLower: -276350,
      tickUpper: -276250,
      currentTick: -276324,
    },
    {
      id: '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
      chainId: 137,
      poolId: '0x45dda9cb7c25131df268515131f647d726f50608',
      poolName: 'USDC/ETH',
      amount0: '99,000',
      symbol0: 'USDC',
      amount1: '28.7',
      symbol1: 'ETH',
      fees0: '425',
      fees1: '0.12',
      age: '4 days',
      pnl: 6.54,
      pnlAdjusted: 4.21,
      tickLower: -500000,
      tickUpper: 50000,
      currentTick: -276324,
    },
    {
      id: '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
      chainId: 8453,
      poolId: '0x4c36388be6f416a29c8d8eee81c771ce6be14b18',
      poolName: 'USDC/ETH',
      amount0: '88,000',
      symbol0: 'USDC',
      amount1: '25.5',
      symbol1: 'ETH',
      fees0: '98',
      fees1: '0.03',
      age: '12 hours',
      pnl: 1.87,
      pnlAdjusted: 1.65,
      tickLower: -276340,
      tickUpper: -276300,
      currentTick: -276324,
    },
    {
      id: '0xa0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
      chainId: 1,
      poolId: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
      poolName: 'USDC/ETH',
      amount0: '72,500',
      symbol0: 'USDC',
      amount1: '21.0',
      symbol1: 'ETH',
      fees0: '2,458',
      fees1: '0.71',
      age: '1 month',
      pnl: 22.34,
      pnlAdjusted: 18.76,
      tickLower: -50000,
      tickUpper: -25000,
      currentTick: -276324,
    },
    {
      id: '0xb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0',
      chainId: 10,
      poolId: '0x85149247691df622eaf1a8bd0cafd40bc45154a9',
      poolName: 'USDC/ETH',
      amount0: '385,000',
      symbol0: 'USDC',
      amount1: '111.5',
      symbol1: 'ETH',
      fees0: '1,534',
      fees1: '0.44',
      age: '8 days',
      pnl: 14.23,
      pnlAdjusted: 10.87,
      tickLower: -276450,
      tickUpper: -276150,
      currentTick: -276324,
    },
    {
      id: '0xc2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1',
      chainId: 42161,
      poolId: '0xc31e54c7a869b9fcbecc14363cf510d1c41fa443',
      poolName: 'USDC/ETH',
      amount0: '198,000',
      symbol0: 'USDC',
      amount1: '57.4',
      symbol1: 'ETH',
      fees0: '478',
      fees1: '0.14',
      age: '2 days',
      pnl: 7.89,
      pnlAdjusted: 5.43,
      tickLower: -300000,
      tickUpper: -250000,
      currentTick: -276324,
    },
    {
      id: '0xd3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2',
      chainId: 1,
      poolId: '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640',
      poolName: 'USDC/ETH',
      amount0: '452,000',
      symbol0: 'USDC',
      amount1: '131.0',
      symbol1: 'ETH',
      fees0: '312',
      fees1: '0.09',
      age: '15 hours',
      pnl: 4.56,
      pnlAdjusted: 3.92,
      tickLower: -276380,
      tickUpper: -276280,
      currentTick: -276324,
    },
    {
      id: '0xe4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
      chainId: 8453,
      poolId: '0x4c36388be6f416a29c8d8eee81c771ce6be14b18',
      poolName: 'USDC/ETH',
      amount0: '123,500',
      symbol0: 'USDC',
      amount1: '35.8',
      symbol1: 'ETH',
      fees0: '1,678',
      fees1: '0.49',
      age: '5 weeks',
      pnl: -11.23,
      pnlAdjusted: -14.56,
      tickLower: -350000,
      tickUpper: -200000,
      currentTick: -276324,
    },
    {
      id: '0xf5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4',
      chainId: 137,
      poolId: '0x45dda9cb7c25131df268515131f647d726f50608',
      poolName: 'USDC/ETH',
      amount0: '267,000',
      symbol0: 'USDC',
      amount1: '77.4',
      symbol1: 'ETH',
      fees0: '1,234',
      fees1: '0.36',
      age: '10 days',
      pnl: 18.45,
      pnlAdjusted: 15.23,
      tickLower: -276420,
      tickUpper: -276220,
      currentTick: -276324,
    },
  ];

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
    positionsLastMonth: 5,
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
