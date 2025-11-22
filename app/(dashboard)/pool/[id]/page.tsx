import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata({
  title: 'Pool Details',
  description: 'Pool analytics and metrics',
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PoolPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Pool Details</h1>
        <p className="text-muted-foreground">Pool ID: {id}</p>
      </div>
      <div>
        <p>Hello World - Pool Page</p>
      </div>
    </div>
  );
}
