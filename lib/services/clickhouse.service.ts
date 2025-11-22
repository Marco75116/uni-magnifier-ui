import clickhouseClient from '@/lib/clients/clickhouse.client';

/**
 * Example service for ClickHouse queries
 * Best practices:
 * 1. Use parameterized queries to prevent SQL injection
 * 2. Handle errors appropriately
 * 3. Type your responses
 * 4. Use async/await
 */

export class ClickHouseService {
  /**
   * Example: Query with parameters
   * Always use query_params for user input to prevent SQL injection
   */
  static async queryWithParams<T = unknown>(
    query: string,
    params: Record<string, unknown> = {}
  ): Promise<T[]> {
    try {
      const resultSet = await clickhouseClient.query({
        query,
        query_params: params,
        format: 'JSONEachRow',
      });

      const data = await resultSet.json<T>();
      return data;
    } catch (error) {
      console.error('ClickHouse query error:', error);
      throw error;
    }
  }

  /**
   * Example: Execute a command (INSERT, CREATE TABLE, etc.)
   */
  static async execute(query: string): Promise<void> {
    try {
      await clickhouseClient.command({
        query,
      });
    } catch (error) {
      console.error('ClickHouse command error:', error);
      throw error;
    }
  }

  /**
   * Example: Insert data
   */
  static async insert<T>(table: string, data: T[]): Promise<void> {
    try {
      await clickhouseClient.insert({
        table,
        values: data,
        format: 'JSONEachRow',
      });
    } catch (error) {
      console.error('ClickHouse insert error:', error);
      throw error;
    }
  }

  /**
   * Example: Get table info
   */
  static async getTableInfo(tableName: string) {
    const query = `
      SELECT
        name,
        type,
        default_expression
      FROM system.columns
      WHERE table = {table:String}
    `;

    return this.queryWithParams<{
      name: string;
      type: string;
      default_expression: string;
    }>(query, { table: tableName });
  }

  /**
   * Example: Check if table exists
   */
  static async tableExists(tableName: string): Promise<boolean> {
    const query = `
      SELECT count() as count
      FROM system.tables
      WHERE name = {table:String}
    `;

    const result = await this.queryWithParams<{ count: string }>(query, {
      table: tableName,
    });

    return parseInt(result[0]?.count || '0') > 0;
  }

  /**
   * Example: Streaming large results
   * Use this for large datasets to avoid memory issues
   */
  static async streamQuery<T = unknown>(
    query: string,
    params: Record<string, unknown> = {},
    onData: (row: T) => void
  ): Promise<void> {
    try {
      const resultSet = await clickhouseClient.query({
        query,
        query_params: params,
        format: 'JSONEachRow',
      });

      const stream = resultSet.stream();

      for await (const rows of stream) {
        for (const row of rows) {
          const data = await row.json<T>();
          onData(data);
        }
      }
    } catch (error) {
      console.error('ClickHouse streaming error:', error);
      throw error;
    }
  }

  /**
   * Example: Ping to check connection
   */
  static async ping(): Promise<boolean> {
    try {
      const result = await clickhouseClient.ping();
      return result.success;
    } catch (error) {
      console.error('ClickHouse ping error:', error);
      return false;
    }
  }
}
