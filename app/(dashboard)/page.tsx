import { generateMetadata } from '@/lib/metadata';
import { getTotalPools } from '@/lib/helpers/queries.helper';

export const metadata = generateMetadata({
  title: 'Template',
  description: 'Template',
});

export default async function Page() {
  const totalPools = await getTotalPools();
  console.log('Total pools:', totalPools);

  return (
    <div className="flex flex-col gap-4">
      <p className="py-4 mt-2 md:mt-0">Hello world</p>
      <p>Total pools: {totalPools}</p>
    </div>
  );
}
