import { ClickHouseService } from '@/lib/services/clickhouse.service';

/**
 * Pool-related queries for ClickHouse
 */

interface TotalPoolsResult {
  total_pools: string;
}

/**
 * Get total count of pools where sign = 1
 */
export async function getTotalPools(): Promise<number> {
  const result = await ClickHouseService.queryWithParams<TotalPoolsResult>(
    'SELECT count(*) as total_pools FROM pools WHERE sign = 1'
  );

  return parseInt(result[0]?.total_pools || '0');
}
