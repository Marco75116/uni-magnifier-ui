import { ClickHouseService } from '@/lib/services/clickhouse.service';
import { networksConfigs } from '@/lib/constants/network.constant';
import { normalizeAddress } from '@/lib/helpers/global.helper';

/**
 * Pool-related queries for ClickHouse
 */

interface TotalPoolsResult {
  total_pools: string;
}

interface BlueChipPoolsResult {
  total_bluechip_pools: string;
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

/**
 * Build SQL query to get bluechip pools across all configured networks
 * A pool is considered bluechip if either currency0 or currency1 matches a bluechip token
 */
export function buildBlueChipPoolsQuery(): string {
  const conditions: string[] = [];

  // Iterate through each network configuration
  for (const [networkKey, config] of Object.entries(networksConfigs)) {
    const chainId = config.chainId;
    const blueChipAddresses = config.blueChipTokens.map((token) =>
      normalizeAddress(token.address)
    );

    // Build condition for this network's bluechip tokens
    if (blueChipAddresses.length > 0) {
      const addressList = blueChipAddresses
        .map((addr) => `'${addr}'`)
        .join(', ');

      const networkCondition = `(
        chainId = ${chainId} AND (
          lower(currency0) IN (${addressList}) OR
          lower(currency1) IN (${addressList})
        )
      )`;

      conditions.push(networkCondition);
    }
  }

  // Combine all network conditions with OR
  const whereClause =
    conditions.length > 0 ? conditions.join(' OR ') : '1 = 0';

  return `
    SELECT count(*) as total_bluechip_pools
    FROM pools
    WHERE sign = 1 AND (${whereClause})
  `;
}

/**
 * Get total count of bluechip pools across all configured networks
 */
export async function getBlueChipPools(): Promise<number> {
  const query = buildBlueChipPoolsQuery();
  const result =
    await ClickHouseService.queryWithParams<BlueChipPoolsResult>(query);

  return parseInt(result[0]?.total_bluechip_pools || '0');
}
