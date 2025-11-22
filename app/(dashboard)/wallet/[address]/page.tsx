import { generateMetadata } from '@/lib/metadata';

export const metadata = generateMetadata({
  title: 'Wallet Details',
  description: 'Wallet analytics and positions',
});

interface PageProps {
  params: Promise<{ address: string }>;
}

export default async function WalletPage({ params }: PageProps) {
  const { address } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Wallet Details</h1>
        <p className="text-muted-foreground">Address: {address}</p>
      </div>
      <div>
        <p>Hello World - Wallet Page</p>
      </div>
    </div>
  );
}
