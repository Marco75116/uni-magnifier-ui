import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, DollarSign, TrendingUp, Layers, Coins, Calendar } from 'lucide-react';

interface WalletStatsCardsProps {
  totalValue: string;
  totalValueChange: string;
  activePositions: number;
  totalPositions: number;
  totalFees: string;
  totalFeesChange: string;
  realizedPnL: string;
  realizedPnLChange: string;
  unrealizedPnL: string;
  unrealizedPnLChangeClass: string;
  positionsLastMonth: number;
}

export function WalletStatsCards({
  totalValue,
  totalValueChange,
  activePositions,
  totalPositions,
  totalFees,
  totalFeesChange,
  realizedPnL,
  realizedPnLChange,
  unrealizedPnL,
  unrealizedPnLChangeClass,
  positionsLastMonth,
}: WalletStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalValue}</div>
          <p className="text-xs text-green-600 dark:text-green-400">{totalValueChange} (24h)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Realized PnL</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${realizedPnLChange}`}>{realizedPnL}</div>
          <p className="text-xs text-muted-foreground">All-time</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">PnL Adjusted</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${unrealizedPnLChangeClass}`}>{unrealizedPnL}</div>
          <p className="text-xs text-muted-foreground">Current positions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalFees}</div>
          <p className="text-xs text-muted-foreground">{totalFeesChange} (24h)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Positions</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPositions}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{positionsLastMonth}</div>
          <p className="text-xs text-muted-foreground">positions created</p>
        </CardContent>
      </Card>
    </div>
  );
}
