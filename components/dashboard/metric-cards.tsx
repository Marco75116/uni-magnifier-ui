import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Droplets, ShieldCheck, Users } from 'lucide-react';
import { networksConfigs } from '@/lib/constants/network.constant';
import { getTotalPools, getBlueChipPools, getTotalPositions } from '@/lib/helpers/queries.helper';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string | React.ReactNode;
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
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

export async function MetricCards() {
  const networkCount = Object.keys(networksConfigs).length;
  const networkNames = Object.values(networksConfigs)
    .map((config) => config.name)
    .join(', ');

  const blueChipTickers = Object.values(networksConfigs)
    .flatMap((config) => config.blueChipTokens.map((token) => token.ticker))
    .filter((ticker, index, self) => self.indexOf(ticker) === index)
    .join(', ');

  const [totalPools, blueChipPools, totalPositions] = await Promise.all([
    getTotalPools(),
    getBlueChipPools(),
    getTotalPositions()
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Supported Networks"
        value={networkCount.toString()}
        subtitle={networkNames}
        icon={<Network className="h-4 w-4 text-muted-foreground" />}
      />
      <MetricCard
        title="Total Pools"
        value={totalPools.toLocaleString()}
        subtitle="Active liquidity pools"
        icon={<Droplets className="h-4 w-4 text-muted-foreground" />}
      />
      <MetricCard
        title="Blue Chip Pools"
        value={blueChipPools.toLocaleString()}
        subtitle={`Paired with ${blueChipTickers}`}
        icon={<ShieldCheck className="h-4 w-4 text-muted-foreground" />}
      />
      <MetricCard
        title="Total LPs"
        value={totalPositions.toLocaleString()}
        subtitle="Active lp positions"
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}
