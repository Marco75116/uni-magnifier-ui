import { generateMetadata } from '@/lib/metadata';
import { getNetworkName, formatFeeTier } from '@/lib/helpers/global.helper';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PoolStatsCards } from '@/components/pool/pool-stats-cards';
import { PoolBalanceCard } from '@/components/pool/pool-balance-card';
import { PoolInfoTable } from '@/components/pool/pool-info-table';
import { PoolPositionsTableWrapper } from '@/components/pool/pool-positions-table-wrapper';
import { PoolAnalyticsCarousel } from '@/components/pool/pool-analytics-carousel';

export const metadata = generateMetadata({
  title: 'Pool Details',
  description: 'Pool analytics and metrics',
});

interface PageProps {
  params: Promise<{ chainId: string; poolId: string }>;
}

export default async function PoolPage({ params }: PageProps) {
  const { chainId, poolId } = await params;
  const chainIdNum = parseInt(chainId);
  const networkName = getNetworkName(chainIdNum);

  // Mock data - will be replaced with real data from ClickHouse
  const currentTick = -276324;

  const rawPositions = [
    {
      id: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      owner: '0x742d35cc6634c0532925a3b844bc9e7595f0beb0',
      amount0: '542,000',
      symbol0: 'USDC',
      amount1: '156.8',
      symbol1: 'ETH',
      age: '3 days',
      pnl: 12.45,
      pnlAdjusted: 8.32,
      tickLower: -887220,
      tickUpper: 887220,
    },
    {
      id: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      owner: '0x853d955acef822db058eb8505911ed77f175b99e',
      amount0: '428,500',
      symbol0: 'USDC',
      amount1: '124.2',
      symbol1: 'ETH',
      age: '5 days',
      pnl: 8.76,
      pnlAdjusted: 5.21,
      tickLower: -276400,
      tickUpper: -276200,
    },
    {
      id: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
      owner: '0x6b175474e89094c44da98b954eedeac495271d0f',
      amount0: '327,100',
      symbol0: 'USDC',
      amount1: '94.8',
      symbol1: 'ETH',
      age: '1 week',
      pnl: -2.34,
      pnlAdjusted: -4.12,
      tickLower: -276500,
      tickUpper: -276100,
    },
    {
      id: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
      owner: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      amount0: '271,500',
      symbol0: 'USDC',
      amount1: '78.7',
      symbol1: 'ETH',
      age: '2 weeks',
      pnl: 15.89,
      pnlAdjusted: 11.45,
      tickLower: -400000,
      tickUpper: -150000,
    },
    {
      id: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      owner: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      amount0: '216,000',
      symbol0: 'USDC',
      amount1: '62.6',
      symbol1: 'ETH',
      age: '18 hours',
      pnl: 3.21,
      pnlAdjusted: 2.87,
      tickLower: -100000,
      tickUpper: 100000,
    },
    {
      id: '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
      owner: '0x514910771af9ca656af840dff83e8264ecf986ca',
      amount0: '160,500',
      symbol0: 'USDC',
      amount1: '46.5',
      symbol1: 'ETH',
      age: '3 weeks',
      pnl: -5.67,
      pnlAdjusted: -8.23,
      tickLower: 200000,
      tickUpper: 450000,
    },
    {
      id: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
      owner: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      amount0: '143,500',
      symbol0: 'USDC',
      amount1: '41.6',
      symbol1: 'ETH',
      age: '6 days',
      pnl: 9.12,
      pnlAdjusted: 6.34,
      tickLower: -276350,
      tickUpper: -276250,
    },
    {
      id: '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
      owner: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      amount0: '99,000',
      symbol0: 'USDC',
      amount1: '28.7',
      symbol1: 'ETH',
      age: '4 days',
      pnl: 6.54,
      pnlAdjusted: 4.21,
      tickLower: -500000,
      tickUpper: 50000,
    },
    {
      id: '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
      owner: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
      amount0: '88,000',
      symbol0: 'USDC',
      amount1: '25.5',
      symbol1: 'ETH',
      age: '12 hours',
      pnl: 1.87,
      pnlAdjusted: 1.65,
      tickLower: -276340,
      tickUpper: -276300,
    },
    {
      id: '0xa0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
      owner: '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',
      amount0: '72,500',
      symbol0: 'USDC',
      amount1: '21.0',
      symbol1: 'ETH',
      age: '1 month',
      pnl: 22.34,
      pnlAdjusted: 18.76,
      tickLower: -50000,
      tickUpper: -25000,
    },
    {
      id: '0xb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0',
      owner: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
      amount0: '385,000',
      symbol0: 'USDC',
      amount1: '111.5',
      symbol1: 'ETH',
      age: '8 days',
      pnl: 14.23,
      pnlAdjusted: 10.87,
      tickLower: -276450,
      tickUpper: -276150,
    },
    {
      id: '0xc2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1',
      owner: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
      amount0: '198,000',
      symbol0: 'USDC',
      amount1: '57.4',
      symbol1: 'ETH',
      age: '2 days',
      pnl: 7.89,
      pnlAdjusted: 5.43,
      tickLower: -300000,
      tickUpper: -250000,
    },
    {
      id: '0xd3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2',
      owner: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
      amount0: '452,000',
      symbol0: 'USDC',
      amount1: '131.0',
      symbol1: 'ETH',
      age: '15 hours',
      pnl: 4.56,
      pnlAdjusted: 3.92,
      tickLower: -276380,
      tickUpper: -276280,
    },
    {
      id: '0xe4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3',
      owner: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
      amount0: '123,500',
      symbol0: 'USDC',
      amount1: '35.8',
      symbol1: 'ETH',
      age: '5 weeks',
      pnl: -11.23,
      pnlAdjusted: -14.56,
      tickLower: -350000,
      tickUpper: -200000,
    },
    {
      id: '0xf5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4',
      owner: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
      amount0: '267,000',
      symbol0: 'USDC',
      amount1: '77.4',
      symbol1: 'ETH',
      age: '10 days',
      pnl: 18.45,
      pnlAdjusted: 15.23,
      tickLower: -276420,
      tickUpper: -276220,
    },
    {
      id: '0xa6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5',
      owner: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
      amount0: '89,500',
      symbol0: 'USDC',
      amount1: '25.9',
      symbol1: 'ETH',
      age: '22 hours',
      pnl: 2.34,
      pnlAdjusted: 1.98,
      tickLower: -276360,
      tickUpper: -276290,
    },
    {
      id: '0xb7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6',
      owner: '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
      amount0: '534,000',
      symbol0: 'USDC',
      amount1: '154.8',
      symbol1: 'ETH',
      age: '4 weeks',
      pnl: 25.67,
      pnlAdjusted: 21.34,
      tickLower: -400000,
      tickUpper: -100000,
    },
    {
      id: '0xc8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7',
      owner: '0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7',
      amount0: '178,000',
      symbol0: 'USDC',
      amount1: '51.6',
      symbol1: 'ETH',
      age: '7 days',
      pnl: -3.45,
      pnlAdjusted: -5.67,
      tickLower: 100000,
      tickUpper: 300000,
    },
    {
      id: '0xd9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8',
      owner: '0xc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8',
      amount0: '312,000',
      symbol0: 'USDC',
      amount1: '90.4',
      symbol1: 'ETH',
      age: '13 days',
      pnl: 11.89,
      pnlAdjusted: 9.12,
      tickLower: -276410,
      tickUpper: -276240,
    },
    {
      id: '0xe0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
      owner: '0xd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
      amount0: '145,000',
      symbol0: 'USDC',
      amount1: '42.0',
      symbol1: 'ETH',
      age: '9 hours',
      pnl: 0.87,
      pnlAdjusted: 0.65,
      tickLower: -276335,
      tickUpper: -276310,
    },
    {
      id: '0xf1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
      owner: '0xe1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
      amount0: '256,000',
      symbol0: 'USDC',
      amount1: '74.2',
      symbol1: 'ETH',
      age: '11 days',
      pnl: 16.78,
      pnlAdjusted: 13.45,
      tickLower: -276440,
      tickUpper: -276210,
    },
    {
      id: '0xa2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1',
      owner: '0xf2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
      amount0: '67,800',
      symbol0: 'USDC',
      amount1: '19.6',
      symbol1: 'ETH',
      age: '3 hours',
      pnl: 1.23,
      pnlAdjusted: 0.98,
      tickLower: -276330,
      tickUpper: -276315,
    },
    {
      id: '0xb3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2',
      owner: '0xa3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
      amount0: '423,000',
      symbol0: 'USDC',
      amount1: '122.6',
      symbol1: 'ETH',
      age: '6 weeks',
      pnl: -8.45,
      pnlAdjusted: -10.23,
      tickLower: -450000,
      tickUpper: -180000,
    },
  ];

  // Compute status based on whether current tick is in range
  const positions = rawPositions.map(pos => {
    const isInRange = currentTick >= pos.tickLower && currentTick <= pos.tickUpper;
    return {
      ...pos,
      status: isInRange ? ('active' as const) : ('inactive' as const),
    };
  });

  const mockPoolData = {
    poolName: 'USDC/ETH',
    fee: 500, // 0.05% in basis points
    tvl: '$125.4M',
    tvlChange: '+2.4%',
    volume24h: '$45.2M',
    volumeCompare: 'vs 7d avg: $38.1M',
    apr: '12.4%',
    currency0: {
      symbol: 'USDC',
      balance: '52,400,000',
      flux24h: { amount: 1200000, percentage: 2.3 },
      flux7d: { amount: 5800000, percentage: 12.4 },
    },
    currency1: {
      symbol: 'ETH',
      balance: '28,450',
      flux24h: { amount: -340, percentage: -1.2 },
      flux7d: { amount: 1200, percentage: 4.4 },
    },
    poolInfo: {
      currency0Address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      currency1Address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      tickSpacing: 10,
      hooks: '0x0000000000000000000000000000000000000000',
      sqrtPriceX96: '1461446703485210103287273052203988822378723970342',
      currentTick: currentTick,
    },
    positions: positions,
  };

  const activePositionsCount = mockPoolData.positions.filter((p) => p.status === 'active').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{mockPoolData.poolName}</h1>
          <Badge variant="secondary">{networkName}</Badge>
          <Badge variant="outline">{formatFeeTier(mockPoolData.fee)}</Badge>
        </div>
        <p className="text-muted-foreground">
          Concentrated liquidity pool on {networkName}
        </p>
      </div>

      {/* Stats Cards */}
      <PoolStatsCards
        tvl={mockPoolData.tvl}
        tvlChange={mockPoolData.tvlChange}
        volume24h={mockPoolData.volume24h}
        volumeCompare={mockPoolData.volumeCompare}
        apr={mockPoolData.apr}
        feeTier={formatFeeTier(mockPoolData.fee)}
      />

      {/* Pool Balances */}
      <div className="grid gap-4 md:grid-cols-2">
        <PoolBalanceCard
          symbol={mockPoolData.currency0.symbol}
          balance={mockPoolData.currency0.balance}
          flux24h={mockPoolData.currency0.flux24h}
          flux7d={mockPoolData.currency0.flux7d}
        />
        <PoolBalanceCard
          symbol={mockPoolData.currency1.symbol}
          balance={mockPoolData.currency1.balance}
          flux24h={mockPoolData.currency1.flux24h}
          flux7d={mockPoolData.currency1.flux7d}
        />
      </div>

      {/* Pool Information and Tabs Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Pool Information */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Pool Information</CardTitle>
              <CardDescription>Technical details and parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <PoolInfoTable
                poolId={poolId}
                currency0={mockPoolData.poolInfo.currency0Address}
                currency1={mockPoolData.poolInfo.currency1Address}
                fee={mockPoolData.fee}
                tickSpacing={mockPoolData.poolInfo.tickSpacing}
                hooks={mockPoolData.poolInfo.hooks}
                sqrtPriceX96={mockPoolData.poolInfo.sqrtPriceX96}
                currentTick={mockPoolData.poolInfo.currentTick}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="positions" className="w-full">
            <TabsList>
              <TabsTrigger value="positions">
                Positions ({mockPoolData.positions.length})
              </TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="positions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Positions</CardTitle>
                  <CardDescription>
                    Showing {mockPoolData.positions.length} positions (
                    {activePositionsCount} active)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PoolPositionsTableWrapper
                    positions={mockPoolData.positions}
                    currentTick={mockPoolData.poolInfo.currentTick}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>Key metrics and performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <PoolAnalyticsCarousel />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
