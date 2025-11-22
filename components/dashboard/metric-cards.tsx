import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Droplets, ShieldCheck, Users } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}

function MetricCard({ title, value, subtitle, icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export function MetricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Supported Networks"
        value="5"
        subtitle="Ethereum, Arbitrum, Base, Optimism, Polygon"
        icon={<Network className="h-4 w-4 text-muted-foreground" />}
      />
      <MetricCard
        title="Total Pools"
        value="10,882"
        subtitle="Active liquidity pools"
        icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
      />
      <MetricCard
        title="Blue Chip Pools"
        value="2,341"
        subtitle="Paired with ETH, USDC, USDT, DAI"
        icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
      />
      <MetricCard
        title="Total LPs"
        value="45,231"
        subtitle="Active liquidity providers"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}
