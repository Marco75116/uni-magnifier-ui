import { generateMetadata } from '@/lib/metadata';
import { getNetworkName } from '@/lib/helpers/global.helper';

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Pool Details</h1>
        <p className="text-muted-foreground">
          Network: {networkName} (Chain ID: {chainId})
        </p>
        <p className="text-muted-foreground">Pool ID: {poolId}</p>
      </div>
      <div>
        <p>Hello World - Pool Page</p>
      </div>
    </div>
  );
}
