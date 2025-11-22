import { createClient } from '@clickhouse/client';

const clickhouseClient = createClient({
  url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
  username: process.env.CLICKHOUSE_USER || 'default',
  password: process.env.CLICKHOUSE_PASSWORD || 'default',
  database: process.env.CLICKHOUSE_DATABASE || 'default',
});

export default clickhouseClient;
