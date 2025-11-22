import { generateMetadata } from '@/lib/metadata';
import { MetricCards } from '@/components/dashboard/metric-cards';
import { PoolExplorer } from '@/components/dashboard/pool-explorer';
import { LPExplorer } from '@/components/dashboard/lp-explorer';

export const metadata = generateMetadata({
  title: 'UniV4 Analytics - LP Strategy Discovery',
  description: 'Discover profitable liquidity provision strategies on Uniswap V4',
});

export default async function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          UniswapV4 Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Comprehensive data analysis to support you in finding your next profitable LP strategy
        </p>
      </div>

      <MetricCards />

      <PoolExplorer />

      <LPExplorer />
    </div>
  );
}
