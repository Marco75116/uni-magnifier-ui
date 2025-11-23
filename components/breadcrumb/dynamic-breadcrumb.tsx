'use client';

import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getNetworkName } from '@/lib/helpers/global.helper';

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    paths.forEach((path, index) => {
      currentPath += `/${path}`;

      // Format path labels
      let label = path;

      // Check if we're in a pool route and this is the chainId parameter
      if (paths[0] === 'pool' && index === 1 && !isNaN(Number(path))) {
        // This is the chainId in /pool/[chainId]/[poolId]
        const chainId = parseInt(path);
        label = getNetworkName(chainId);
      }
      // Check if it's an Ethereum address or long hash (starts with 0x)
      else if (path.startsWith('0x') && path.length > 20) {
        label = `${path.slice(0, 6)}...${path.slice(-4)}`;
      } else {
        // Capitalize first letter for regular paths
        label = path.charAt(0).toUpperCase() + path.slice(1);
      }

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
