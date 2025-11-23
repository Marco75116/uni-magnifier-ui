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

interface TotalPositionsResult {
  total_positions: string;
}

/**
 * Get total count of distinct positions
 */
export async function getTotalPositions(): Promise<number> {
  const result = await ClickHouseService.queryWithParams<TotalPositionsResult>(
    'SELECT count(DISTINCT position_id) as total_positions FROM positions'
  );

  return parseInt(result[0]?.total_positions || '0');
}

export interface PoolData {
  chainId: number;
  pool_id: string;
  currency0: string;
  currency1: string;
  fee: number;
  tick_spacing: number;
  hooks: string;
  sqrt_price_x96: string;
  tick: number;
}

/**
 * Get top 5 pools ordered by most recent
 */
export async function getTopPools(limit: number = 5): Promise<PoolData[]> {
  const query = `
    SELECT
      chainId,
      pool_id,
      currency0,
      currency1,
      fee,
      tick_spacing,
      hooks,
      sqrt_price_x96,
      tick
    FROM pools
    WHERE sign = 1
    ORDER BY timestamp DESC
    LIMIT ${limit}
  `;

  const result = await ClickHouseService.queryWithParams<PoolData>(query);
  return result;
}

export interface LiquidityProviderData {
  wallet_address: string;
  total_positions: string;
  unique_pools: string;
  first_position_date: string; // DateTime string from ClickHouse
}

/**
 * Get top liquidity providers with 12-150 positions
 * Ordered by earliest position date (most experienced first)
 */
export async function getTopLiquidityProviders(limit: number = 5): Promise<LiquidityProviderData[]> {
  const query = `
    SELECT
      sender as wallet_address,
      count(DISTINCT position_id) as total_positions,
      count(DISTINCT pool_id) as unique_pools,
      min(last_updated_timestamp) as first_position_date
    FROM positions
    GROUP BY sender
    HAVING total_positions >= 12 AND total_positions <= 150
    ORDER BY first_position_date ASC
    LIMIT ${limit}
  `;

  const result = await ClickHouseService.queryWithParams<LiquidityProviderData>(query);
  return result;
}

interface WalletTotalPositionsResult {
  total_positions: string;
}

/**
 * Get total count of positions for a specific wallet address
 */
export async function getWalletTotalPositions(walletAddress: string): Promise<number> {
  const query = `
    SELECT
      COUNT(*) as total_positions
    FROM positions
    WHERE sender = '${walletAddress.toLowerCase()}'
  `;

  const result = await ClickHouseService.queryWithParams<WalletTotalPositionsResult>(query);
  return parseInt(result[0]?.total_positions || '0');
}
