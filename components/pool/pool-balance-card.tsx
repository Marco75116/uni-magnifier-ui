import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface FluxData {
  amount: number;
  percentage: number;
}

interface PoolBalanceCardProps {
  symbol: string;
  balance: string;
  flux24h: FluxData;
  flux7d: FluxData;
}

export function PoolBalanceCard({ symbol, balance, flux24h, flux7d }: PoolBalanceCardProps) {
  const FluxIndicator = ({ flux, label }: { flux: FluxData; label: string }) => {
    const isPositive = flux.amount >= 0;
    const colorClass = isPositive
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
    const Icon = isPositive ? ArrowUp : ArrowDown;

    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground">{label}:</span>
        <div className={`flex items-center gap-0.5 ${colorClass}`}>
          <Icon className="h-3 w-3" />
          <span className="text-sm font-medium">
            {Math.abs(flux.amount).toLocaleString()} ({isPositive ? '+' : ''}
            {flux.percentage.toFixed(2)}%)
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{symbol} Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{balance}</div>
        <div className="mt-2 flex flex-col gap-1">
          <FluxIndicator flux={flux24h} label="24h" />
          <FluxIndicator flux={flux7d} label="7d" />
        </div>
      </CardContent>
    </Card>
  );
}
