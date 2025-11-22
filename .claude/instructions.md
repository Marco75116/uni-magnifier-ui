# Uniswap Analytics Platform - Development Instructions

## Project Overview
Building a professional-grade Uniswap analytics application for asset managers and hedge funds. The platform provides deep insights into DEX trading, liquidity pools, token metrics, and portfolio analytics.

## Target Audience
- Asset Managers
- Hedge Funds
- Professional Traders
- DeFi Analysts

## Tech Stack

### Core Framework
- **Next.js 15** with App Router
- **React 19**
- **TypeScript 5** (strict mode enabled)
- **Tailwind CSS v4**

### UI Components
- **Shadcn UI** (https://ui.shadcn.com/docs/components)
  - Use components from the official library
  - Maintain consistency across the app
  - Follow the New York style variant
  - Available components: https://ui.shadcn.com/docs/components

### Data & State
- **TanStack React Query v5** for server state
- **Axios** for HTTP requests
- **Ethers.js v6** for blockchain interactions

### Blockchain Integration
- **Octav Portfolio API** for portfolio data
- **Uniswap V2/V3 Subgraph** for DEX analytics
- **The Graph Protocol** for on-chain data

### Database
- **ClickHouse** for analytics and time-series data
  - Client: `@clickhouse/client`
  - Connection: HTTP interface on port 8123
  - Service layer: `lib/services/clickhouse.service.ts`
  - Client config: `lib/clients/clickhouse.client.ts`

---

## Code Standards & Architecture

### Design Philosophy
**PROFESSIONAL. CLEAN. SOBER.**
- No unnecessary animations or flashy effects
- Focus on data clarity and usability
- Institutional-grade interface
- Performance-first approach

### Code Organization

#### Component Structure
```
components/
├── ui/              # Shadcn UI primitives (button, dialog, etc.)
├── analytics/       # Analytics-specific components
│   ├── charts/      # Chart components (price, volume, liquidity)
│   ├── tables/      # Data table components
│   ├── metrics/     # Metric cards and displays
│   └── filters/     # Filter components
├── layout/          # Layout components (sidebar, header, nav)
└── shared/          # Reusable components across features
```

#### Helper Functions
- **Location**: `lib/helpers/global.helper.ts`
- **Purpose**: Centralize utility functions
- **Examples**:
  - Number formatting (currency, percentages, abbreviations)
  - Date/time utilities
  - Address truncation
  - Data transformations
  - Validation helpers

#### Service Layer
```
lib/
├── services/
│   ├── clickhouse.service.ts  # ClickHouse queries (main service)
│   ├── uniswap/
│   │   ├── pools.ts       # Pool data fetching
│   │   ├── tokens.ts      # Token data fetching
│   │   ├── swaps.ts       # Swap history
│   │   └── loader.ts      # React Query hooks
│   ├── octav/
│   │   └── portfolio.ts   # Portfolio integration
│   └── blockchain/
│       └── contracts.ts   # Smart contract interactions
└── clients/
    └── clickhouse.client.ts   # ClickHouse client singleton
```

---

## ClickHouse Integration

### Setup & Configuration

ClickHouse is used for storing and querying analytics data, time-series data, and large datasets efficiently.

**Environment Variables** (`.env.local`):
```bash
CLICKHOUSE_URL="http://localhost:8123"
CLICKHOUSE_USER="default"
CLICKHOUSE_PASSWORD="default"
CLICKHOUSE_DATABASE="default"
```

**Docker Setup**:
```yaml
services:
  clickhouse:
    image: clickhouse/clickhouse-server:latest
    ports:
      - "8123:8123"
    environment:
      CLICKHOUSE_USER: default
      CLICKHOUSE_PASSWORD: default
```

### Best Practices

#### 1. Always Use Parameterized Queries
**CRITICAL**: Never concatenate user input into SQL queries. Always use parameters to prevent SQL injection.

```typescript
// ✅ GOOD - Safe from SQL injection
const pools = await ClickHouseService.queryWithParams<Pool>(
  `SELECT * FROM pools WHERE pool_address = {address:String}`,
  { address: userInput }
);

// ❌ BAD - Vulnerable to SQL injection
const pools = await ClickHouseService.queryWithParams(
  `SELECT * FROM pools WHERE pool_address = '${userInput}'`
);
```

#### 2. Type Your Responses
Always define TypeScript interfaces for query results:

```typescript
interface PoolData {
  pool_address: string;
  token0: string;
  token1: string;
  tvl: string;  // ClickHouse returns numbers as strings
  volume_24h: string;
}

const pools = await ClickHouseService.queryWithParams<PoolData>(
  query,
  params
);
```

#### 3. Use Streaming for Large Results
For queries that return large datasets, use streaming to avoid memory issues:

```typescript
await ClickHouseService.streamQuery<SwapEvent>(
  `SELECT * FROM swaps WHERE timestamp >= {startDate:DateTime}`,
  { startDate: '2024-01-01 00:00:00' },
  (row) => {
    // Process each row as it arrives
    processSwapEvent(row);
  }
);
```

#### 4. Handle Errors Gracefully
Always wrap ClickHouse queries in try-catch blocks:

```typescript
try {
  const data = await ClickHouseService.queryWithParams(query, params);
  return data;
} catch (error) {
  console.error('ClickHouse query failed:', error);
  throw new Error('Failed to fetch pool data');
}
```

### Common Query Patterns

#### Fetching Pool Data
```typescript
const pools = await ClickHouseService.queryWithParams<Pool>(
  `
  SELECT
    pool_address,
    token0_symbol,
    token1_symbol,
    tvl,
    volume_24h,
    fee_tier
  FROM pools
  WHERE chain_id = {chainId:UInt64}
    AND tvl > {minTvl:Float64}
  ORDER BY tvl DESC
  LIMIT {limit:UInt32}
  `,
  {
    chainId: 1,
    minTvl: 100000,
    limit: 100
  }
);
```

#### Time-Series Aggregations
```typescript
const volumeByDay = await ClickHouseService.queryWithParams<{
  date: string;
  total_volume: string;
}>(
  `
  SELECT
    toDate(timestamp) as date,
    sum(volume_usd) as total_volume
  FROM swaps
  WHERE pool_address = {poolAddress:String}
    AND timestamp >= {startTime:DateTime}
  GROUP BY date
  ORDER BY date
  `,
  {
    poolAddress: '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640',
    startTime: '2024-01-01 00:00:00'
  }
);
```

#### Inserting Data
```typescript
await ClickHouseService.insert('swaps', [
  {
    pool_address: '0x123...',
    timestamp: new Date().toISOString(),
    amount0: '1000.5',
    amount1: '2000.75',
    sender: '0xabc...',
  }
]);
```

### ClickHouse Data Types

When using query parameters, specify the correct type:

| Type | Example | Use Case |
|------|---------|----------|
| `String` | `{param:String}` | Addresses, text |
| `UInt64` | `{param:UInt64}` | Chain IDs, block numbers |
| `Int64` | `{param:Int64}` | Signed integers |
| `Float64` | `{param:Float64}` | Prices, amounts |
| `DateTime` | `{param:DateTime}` | Timestamps |
| `UUID` | `{param:UUID}` | UUIDs |
| `Array(String)` | `{param:Array(String)}` | Arrays |

### Server Component Example

Query ClickHouse directly from Server Components (no API routes needed for read-only queries):

```typescript
// app/(dashboard)/pools/page.tsx
import { ClickHouseService } from '@/lib/services/clickhouse.service';

interface Pool {
  pool_address: string;
  token0_symbol: string;
  token1_symbol: string;
  tvl: string;
  volume_24h: string;
}

export default async function PoolsPage() {
  // Query directly in server component
  const pools = await ClickHouseService.queryWithParams<Pool>(
    `
    SELECT
      pool_address,
      token0_symbol,
      token1_symbol,
      tvl,
      volume_24h
    FROM pools
    WHERE chain_id = {chainId:UInt64}
    ORDER BY tvl DESC
    LIMIT {limit:UInt32}
    `,
    { chainId: 1, limit: 100 }
  );

  return (
    <div>
      <h1>Top Pools</h1>
      {pools.map((pool) => (
        <div key={pool.pool_address}>
          {pool.token0_symbol}/{pool.token1_symbol}
        </div>
      ))}
    </div>
  );
}
```

### Service Layer Files

- **Client**: `lib/clients/clickhouse.client.ts` - Singleton ClickHouse client
- **Service**: `lib/services/clickhouse.service.ts` - Helper methods for queries

### Performance Tips

1. **Server Components**: Query directly in Server Components for initial data (no client-side fetch needed)
2. **Limit data points**: Use `LIMIT` clause for large result sets
3. **Index properly**: Ensure tables have proper ORDER BY keys
4. **Aggregate old data**: Use materialized views for historical aggregations
5. **Next.js Caching**: Leverage Next.js data caching and revalidation strategies

---

## UI/UX Guidelines

### Color Palette
- **Primary**: Professional blues/grays
- **Success**: Green (gains, positive metrics)
- **Danger**: Red (losses, negative metrics)
- **Neutral**: Grayscale for backgrounds and borders
- **Dark Mode**: Full support required

### Typography
- **Headings**: Clear hierarchy (h1-h6)
- **Body**: Readable font sizes (14-16px)
- **Monospace**: For addresses, hashes, and numeric data
- **Font Weights**: Use 400, 500, 600, 700 strategically

### Layout Principles
1. **Sidebar Navigation**: Persistent left sidebar (desktop), collapsible on mobile
2. **Content Area**: Clean, spacious layout with proper padding
3. **Grid System**: Use Tailwind's grid for responsive layouts
4. **White Space**: Generous spacing for readability
5. **Responsive**: Mobile-first design, perfect on all devices

### Data Visualization
- **Charts**: Use recharts or lightweight alternatives
- **Tables**: Sortable, filterable, paginated
- **Metrics**: Large, clear numbers with context
- **Trends**: Show directional indicators (↑↓) and percentages

---

## Component Best Practices

### 1. Component Composition
```typescript
// ✅ GOOD: Small, focused components
export function MetricCard({ title, value, change }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">{value}</p>
        <TrendIndicator change={change} />
      </CardContent>
    </Card>
  );
}

// ❌ BAD: Monolithic components
// Avoid giant components with 500+ lines
```

### 2. Type Safety
```typescript
// ✅ GOOD: Explicit types for all props and data
interface PoolData {
  id: string;
  token0: Token;
  token1: Token;
  tvl: number;
  volume24h: number;
  feeTier: number;
}

// ❌ BAD: Using 'any' or missing types
// const data: any = ...
```

### 3. Utility Functions
```typescript
// ✅ GOOD: Centralized in global.helper.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function abbreviateNumber(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
  return value.toFixed(2);
}

export function truncateAddress(address: string, chars: number = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
```

### 4. Data Fetching
```typescript
// ✅ GOOD: React Query hooks with proper error handling
export function usePoolData(poolId: string) {
  return useQuery({
    queryKey: ['pool', poolId],
    queryFn: () => fetchPoolData(poolId),
    staleTime: 60000, // 1 minute
    retry: 3,
  });
}

// Usage in component
function PoolDetails({ poolId }: { poolId: string }) {
  const { data, isLoading, error } = usePoolData(poolId);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorCard error={error} />;
  if (!data) return <EmptyState />;

  return <PoolDetailsView data={data} />;
}
```

### 5. Conditional Rendering
```typescript
// ✅ GOOD: Early returns for loading/error states
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState message="No data available" />;

// ❌ BAD: Nested ternaries
// return isLoading ? <Spinner /> : error ? <Error /> : data ? <Content /> : null;
```

---

## Shadcn UI Component Usage

### Installing Components
```bash
# Install specific components as needed
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add chart
npx shadcn@latest add tabs
npx shadcn@latest add select
npx shadcn@latest add dialog
```

### Commonly Used Components
1. **Card** - For metric displays, pool cards
2. **Table** - For transaction history, token lists
3. **Tabs** - For switching between views
4. **Select/Dropdown** - For filters and options
5. **Dialog** - For detailed views and modals
6. **Button** - For actions
7. **Badge** - For tags and status indicators
8. **Skeleton** - For loading states
9. **Chart** - For data visualization
10. **Input** - For search and forms

### Component Customization
```typescript
// Extend Shadcn components with custom variants
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  variant?: 'default' | 'highlight' | 'danger'
  // ... other props
}

export function MetricCard({ variant = 'default', className, ...props }: MetricCardProps) {
  return (
    <Card
      className={cn(
        "transition-colors",
        variant === 'highlight' && "border-blue-500 bg-blue-50 dark:bg-blue-950",
        variant === 'danger' && "border-red-500 bg-red-50 dark:bg-red-950",
        className
      )}
      {...props}
    />
  )
}
```

---

## Feature Requirements

### Dashboard Overview
- **Total Value Locked (TVL)** across pools
- **24h Trading Volume**
- **Top Performing Pools**
- **Recent Swaps**
- **Portfolio Summary** (if wallet connected)

### Pool Analytics
- **Pool List**: Sortable table with TVL, volume, APR
- **Pool Details**: Deep dive into specific pool metrics
- **Liquidity Charts**: Historical TVL and liquidity depth
- **Fee Analysis**: Fee tier performance

### Token Analytics
- **Token Price Charts**: Real-time and historical
- **Volume Analysis**: Buy/sell volume breakdown
- **Holder Analysis**: Top holders, distribution
- **Token Comparison**: Side-by-side comparison tool

### Portfolio Tracking
- **Position Tracking**: Current LP positions
- **P&L Analysis**: Realized and unrealized gains
- **Impermanent Loss**: Calculator and tracking
- **Transaction History**: Complete swap and LP history

### Advanced Features
- **Custom Alerts**: Price alerts, volume spikes
- **Whale Watching**: Track large transactions
- **Market Sentiment**: Social and on-chain signals
- **Export Data**: CSV/Excel export for analysis

---

## Charts & Data Visualization

### Chart Component Library
We use **Shadcn Charts** built on top of **Recharts** for all data visualization.

**Documentation**:
- Main Docs: https://ui.shadcn.com/docs/components/chart
- Chart Examples: https://ui.shadcn.com/charts

### Installing Chart Components
```bash
npx shadcn@latest add chart
```

### Available Chart Types

#### 1. Area Charts
Perfect for showing trends over time (price, volume, TVL)
- **Examples**: https://ui.shadcn.com/charts/area
- **Use Cases**: Token price over time, TVL trends, cumulative volume
- **Variants**: Stacked, gradient, interactive, step

```typescript
// Example: Price Chart
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

const priceData = [
  { date: "2024-01-01", price: 1800 },
  { date: "2024-01-02", price: 1850 },
  // ... more data
]

export function PriceChart() {
  return (
    <ChartContainer config={chartConfig}>
      <AreaChart data={priceData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" />
        <ChartTooltip />
        <Area
          dataKey="price"
          fill="hsl(var(--chart-1))"
          stroke="hsl(var(--chart-1))"
        />
      </AreaChart>
    </ChartContainer>
  )
}
```

#### 2. Line Charts
Clean visualization for multiple metrics comparison
- **Examples**: https://ui.shadcn.com/charts/line
- **Use Cases**: Multi-token comparison, fee tier analysis
- **Variants**: Multiple lines, stepped, curved

```typescript
// Example: Multi-Token Comparison
<LineChart data={tokenData}>
  <CartesianGrid vertical={false} />
  <XAxis dataKey="date" />
  <ChartTooltip />
  <Line
    dataKey="tokenA"
    stroke="hsl(var(--chart-1))"
    strokeWidth={2}
  />
  <Line
    dataKey="tokenB"
    stroke="hsl(var(--chart-2))"
    strokeWidth={2}
  />
</LineChart>
```

#### 3. Bar Charts
Great for comparing discrete values
- **Examples**: https://ui.shadcn.com/charts/bar
- **Use Cases**: Volume by day, pool comparison, fee distribution
- **Variants**: Vertical, horizontal, stacked, grouped

```typescript
// Example: Daily Volume
<BarChart data={volumeData}>
  <CartesianGrid vertical={false} />
  <XAxis dataKey="day" />
  <ChartTooltip />
  <Bar dataKey="volume" fill="hsl(var(--chart-1))" radius={4} />
</BarChart>
```

#### 4. Pie/Donut Charts
Portfolio composition and distribution
- **Examples**: https://ui.shadcn.com/charts/pie
- **Use Cases**: Asset allocation, liquidity distribution, holder breakdown
- **Variants**: Donut, interactive labels

```typescript
// Example: Portfolio Allocation
<PieChart>
  <ChartTooltip />
  <Pie
    data={allocationData}
    dataKey="value"
    nameKey="asset"
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={80}
  />
</PieChart>
```

#### 5. Radar Charts
Multi-dimensional comparison
- **Examples**: https://ui.shadcn.com/charts/radar
- **Use Cases**: Pool metrics comparison, risk assessment
- **Variants**: Multiple radars, filled, outlined

```typescript
// Example: Pool Metrics
<RadarChart data={poolMetrics}>
  <PolarGrid />
  <PolarAngleAxis dataKey="metric" />
  <PolarRadiusAxis />
  <Radar
    dataKey="value"
    fill="hsl(var(--chart-1))"
    fillOpacity={0.6}
  />
</RadarChart>
```

#### 6. Candlestick Charts
OHLC price data (requires custom implementation)
- **Use Cases**: Advanced price analysis
- **Note**: Build using ComposedChart from Recharts

### Chart Tooltips
Enhanced tooltips with custom formatting
- **Examples**: https://ui.shadcn.com/charts/tooltip
- **Features**: Custom content, formatting, cross-chart sync

```typescript
// Custom Tooltip with formatting
<ChartTooltip
  content={({ active, payload }) => {
    if (!active || !payload) return null
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">
              {formatCurrency(payload[0].value)}
            </span>
          </div>
        </div>
      </div>
    )
  }}
/>
```

### Chart Best Practices

#### 1. Responsive Design
```typescript
// Use ChartContainer for responsive sizing
<ChartContainer
  config={chartConfig}
  className="h-[300px] w-full"
>
  <AreaChart data={data}>
    {/* chart components */}
  </AreaChart>
</ChartContainer>
```

#### 2. Chart Configuration
```typescript
// Define chart config for consistent theming
const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
  volume: {
    label: "Volume",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig
```

#### 3. Loading States
```typescript
// Show skeleton while data loads
if (isLoading) {
  return <Skeleton className="h-[300px] w-full" />
}

// Handle empty data
if (!data || data.length === 0) {
  return (
    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
      No data available
    </div>
  )
}
```

#### 4. Data Formatting
```typescript
// Format data for charts using helper functions
const formattedData = rawData.map((item) => ({
  date: formatDate(item.timestamp),
  price: Number(item.price),
  volume: Number(item.volume),
}))
```

#### 5. Color Scheme
Use CSS variables for consistent theming:
- `hsl(var(--chart-1))` - Primary data
- `hsl(var(--chart-2))` - Secondary data
- `hsl(var(--chart-3))` - Tertiary data
- `hsl(var(--chart-4))` - Additional data
- `hsl(var(--chart-5))` - Additional data

### Common Chart Patterns

#### Price Chart with Volume
```typescript
<div className="space-y-4">
  {/* Price Chart */}
  <Card>
    <CardHeader>
      <CardTitle>Price</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="h-[200px]">
        <AreaChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" />
          <ChartTooltip />
          <Area dataKey="price" fill="hsl(var(--chart-1))" />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>

  {/* Volume Chart */}
  <Card>
    <CardHeader>
      <CardTitle>Volume</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="h-[100px]">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" />
          <ChartTooltip />
          <Bar dataKey="volume" fill="hsl(var(--chart-2))" />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
</div>
```

#### Interactive Chart with Time Range
```typescript
const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '1Y'>('1W')

// Filter data based on time range
const filteredData = useMemo(() => {
  return filterDataByTimeRange(data, timeRange)
}, [data, timeRange])

return (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Price Chart</CardTitle>
      <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v)}>
        <TabsList>
          <TabsTrigger value="1D">1D</TabsTrigger>
          <TabsTrigger value="1W">1W</TabsTrigger>
          <TabsTrigger value="1M">1M</TabsTrigger>
          <TabsTrigger value="1Y">1Y</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig} className="h-[300px]">
        <AreaChart data={filteredData}>
          {/* chart components */}
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
)
```

### Chart Component Organization
```
components/
├── charts/
│   ├── PriceChart.tsx         # Token price over time
│   ├── VolumeChart.tsx        # Trading volume
│   ├── LiquidityChart.tsx     # Pool liquidity
│   ├── PortfolioChart.tsx     # Portfolio allocation
│   ├── ComparisonChart.tsx    # Multi-token comparison
│   └── shared/
│       ├── ChartHeader.tsx    # Reusable chart header with controls
│       ├── ChartTooltip.tsx   # Custom tooltip components
│       └── ChartLegend.tsx    # Custom legend components
```

### Real-World Chart Examples

#### 1. TVL Chart (Stacked Area)
Shows total value locked across multiple pools
```typescript
<ChartContainer config={chartConfig} className="h-[400px]">
  <AreaChart data={tvlData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="date" />
    <YAxis tickFormatter={(value) => formatCompactCurrency(value)} />
    <ChartTooltip
      content={({ payload }) => (
        <CustomTooltip payload={payload} formatter={formatCurrency} />
      )}
    />
    <Area
      dataKey="pool1"
      stackId="1"
      fill="hsl(var(--chart-1))"
    />
    <Area
      dataKey="pool2"
      stackId="1"
      fill="hsl(var(--chart-2))"
    />
  </AreaChart>
</ChartContainer>
```

#### 2. Fee Performance (Multi-Line)
Compare fees across different pools
```typescript
<ChartContainer config={chartConfig} className="h-[300px]">
  <LineChart data={feeData}>
    <CartesianGrid vertical={false} />
    <XAxis dataKey="date" />
    <YAxis tickFormatter={(value) => `${value}%`} />
    <ChartTooltip />
    <Legend />
    <Line
      dataKey="pool0.3"
      stroke="hsl(var(--chart-1))"
      name="0.3% Fee"
    />
    <Line
      dataKey="pool0.05"
      stroke="hsl(var(--chart-2))"
      name="0.05% Fee"
    />
    <Line
      dataKey="pool1.0"
      stroke="hsl(var(--chart-3))"
      name="1.0% Fee"
    />
  </LineChart>
</ChartContainer>
```

### Chart Performance Tips

1. **Limit data points**: Show max 100-200 points, aggregate older data
2. **Lazy load**: Use dynamic imports for chart components
3. **Memoize data**: Use `useMemo` for data transformations
4. **Debounce interactions**: Debounce zoom/pan events
5. **Virtual rendering**: For very large datasets, consider data sampling

### Accessing Chart Examples

To get ready-to-use chart code:
1. Visit: https://ui.shadcn.com/charts
2. Browse chart types (area, line, bar, pie, radar, etc.)
3. Click **"View Code"** button on any example
4. Or use the **copy button** to grab the code directly
5. Adapt the example to your data structure

**Most useful examples for this project**:
- Area Chart - Stacked: https://ui.shadcn.com/charts/area#stacked
- Line Chart - Multiple: https://ui.shadcn.com/charts/line#multiple
- Bar Chart - Interactive: https://ui.shadcn.com/charts/bar#interactive
- Tooltip - Custom: https://ui.shadcn.com/charts/tooltip#custom

---

## Performance Optimization

### 1. Code Splitting
```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/charts/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
});
```

### 2. Memoization
```typescript
// Memoize expensive calculations
const sortedPools = useMemo(() => {
  return pools.sort((a, b) => b.tvl - a.tvl);
}, [pools]);

// Memoize callbacks
const handlePoolSelect = useCallback((poolId: string) => {
  setSelectedPool(poolId);
}, []);
```

### 3. Data Fetching
- Use React Query's built-in caching
- Set appropriate `staleTime` for different data types
- Implement pagination for large datasets
- Use optimistic updates where appropriate

---

## Testing & Quality

### Code Quality Checklist
- [ ] No TypeScript errors
- [ ] All components are properly typed
- [ ] No `any` types (except where absolutely necessary)
- [ ] No console.logs in production code
- [ ] Proper error handling on all API calls
- [ ] Loading states for all async operations
- [ ] Empty states when no data is available
- [ ] Mobile responsive (test on 375px, 768px, 1024px, 1440px)
- [ ] Dark mode works correctly
- [ ] All helpers are in `global.helper.ts`
- [ ] No duplicated code (DRY principle)

### File Organization Checklist
- [ ] Components are in appropriate folders
- [ ] One component per file
- [ ] Exports are at the bottom of files
- [ ] Imports are organized (React, third-party, local)
- [ ] File names match component names
- [ ] Types/interfaces are co-located or in `types/` folder

---

## Common Patterns

### 1. Metric Display
```typescript
<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium text-muted-foreground">
      Total Value Locked
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{formatCurrency(tvl)}</div>
    <p className="text-xs text-muted-foreground">
      <TrendIndicator value={tvlChange24h} /> from yesterday
    </p>
  </CardContent>
</Card>
```

### 2. Data Tables
```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Pool</TableHead>
      <TableHead>TVL</TableHead>
      <TableHead>Volume 24h</TableHead>
      <TableHead>APR</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {pools.map((pool) => (
      <TableRow key={pool.id}>
        <TableCell>
          <PoolName pool={pool} />
        </TableCell>
        <TableCell>{formatCurrency(pool.tvl)}</TableCell>
        <TableCell>{formatCurrency(pool.volume24h)}</TableCell>
        <TableCell>
          <Badge variant={pool.apr > 50 ? 'success' : 'default'}>
            {pool.apr.toFixed(2)}%
          </Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### 3. Loading States
```typescript
if (isLoading) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
```

---

## Development Workflow

1. **Plan the feature**: Understand requirements clearly
2. **Create types**: Define TypeScript interfaces first
3. **Build helpers**: Add utility functions to `global.helper.ts`
4. **Create service layer**: API calls and React Query hooks
5. **Build UI components**: Start with small, focused components
6. **Compose larger views**: Combine components into pages
7. **Test responsiveness**: Check mobile, tablet, desktop
8. **Optimize**: Memoize, lazy load, split code as needed
9. **Review**: Check against quality checklist

---

## Important Notes

- **Never use emojis** in the UI (professional environment)
- **Always format numbers** using helper functions
- **Handle all error states** gracefully
- **Show loading states** for all async operations
- **Use semantic HTML** for accessibility
- **Follow Tailwind conventions** (don't create custom CSS unless necessary)
- **Keep components small** (< 200 lines ideally)
- **Write self-documenting code** (clear variable names, minimal comments)
- **Favor composition** over inheritance
- **Keep it simple** (KISS principle)

---

## Resources

### UI & Components
- **Shadcn UI Docs**: https://ui.shadcn.com/docs
- **Shadcn Components**: https://ui.shadcn.com/docs/components
- **Shadcn Charts**: https://ui.shadcn.com/charts
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev/icons/

### Data & State Management
- **React Query**: https://tanstack.com/query/latest
- **Axios**: https://axios-http.com/docs/intro

### Blockchain & DeFi
- **Uniswap Docs**: https://docs.uniswap.org/

### Development Tools
- **Next.js Docs**: https://nextjs.org/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **React Docs**: https://react.dev/

---

## Quick Reference

### Common Imports
```typescript
// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Charts
import { ChartContainer, ChartTooltip, ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"

// Utilities
import { formatCurrency, formatPercentage, abbreviateNumber } from "@/lib/helpers/global.helper"
import { cn } from "@/lib/utils"

// Data Fetching
import { useQuery, useMutation } from "@tanstack/react-query"
import axios from "axios"
```

### CSS Variable Reference
```css
/* Chart Colors */
--chart-1: /* Primary */
--chart-2: /* Secondary */
--chart-3: /* Tertiary */
--chart-4: /* Additional */
--chart-5: /* Additional */

/* Theme Colors */
--background: /* Page background */
--foreground: /* Text color */
--muted: /* Muted background */
--muted-foreground: /* Muted text */
--border: /* Border color */
--primary: /* Primary color */
--destructive: /* Error/danger color */
```

### Responsive Breakpoints
```typescript
// Tailwind breakpoints
sm: 640px   // Small devices
md: 768px   // Tablets
lg: 1024px  // Laptops
xl: 1280px  // Desktops
2xl: 1536px // Large screens
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `PriceChart.tsx`)
- **Utilities**: camelCase (e.g., `global.helper.ts`)
- **Types**: PascalCase (e.g., `Pool.ts`)
- **Services**: camelCase (e.g., `pools.ts`)
- **Hooks**: camelCase starting with `use` (e.g., `usePoolData.ts`)

---

## Additional Best Practices

### API Integration
```typescript
// Always handle loading, error, and empty states
function PoolList() {
  const { data, isLoading, error } = usePoolData()

  if (isLoading) return <PoolListSkeleton />
  if (error) return <ErrorState error={error} retry={() => refetch()} />
  if (!data?.length) return <EmptyState message="No pools found" />

  return <PoolTable pools={data} />
}
```

### Type Safety
```typescript
// Define interfaces for all data structures
interface Pool {
  id: string
  token0: Token
  token1: Token
  tvl: number
  volume24h: number
  feeTier: number
  apr?: number
}

interface Token {
  address: string
  symbol: string
  name: string
  decimals: number
  logoUrl?: string
}
```

### Error Handling
```typescript
// Centralized error handling
async function fetchPoolData(poolId: string): Promise<Pool> {
  try {
    const response = await axios.get(`/api/pools/${poolId}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      throw new Error(`Failed to fetch pool: ${message}`)
    }
    throw error
  }
}
```

### Accessibility
```typescript
// Always include proper ARIA labels
<button
  aria-label="Sort by TVL descending"
  onClick={() => handleSort('tvl', 'desc')}
>
  TVL
</button>

// Use semantic HTML
<nav aria-label="Main navigation">
  {/* navigation items */}
</nav>

<main aria-label="Dashboard content">
  {/* main content */}
</main>
```

### Dark Mode Support
```typescript
// Use Tailwind dark mode classes
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-gray-100">
    Content that works in both themes
  </p>
</div>

// Use CSS variables (preferred)
<div className="bg-background text-foreground">
  Automatically adapts to theme
</div>
```

---

## Troubleshooting

### Common Issues

**Issue**: Chart not rendering
- Check if data is properly formatted
- Ensure ChartContainer has height set
- Verify all required chart props are provided

**Issue**: TypeScript errors
- Check type definitions match data structure
- Use `satisfies` for type inference: `const config = {...} satisfies ChartConfig`
- Avoid using `any`, use `unknown` and type guards instead

**Issue**: Performance problems
- Memoize expensive calculations with `useMemo`
- Use React Query caching effectively
- Limit chart data points (100-200 max)
- Lazy load heavy components

**Issue**: Styling not applying
- Check Tailwind class ordering (specific classes last)
- Use `cn()` utility for conditional classes
- Verify no conflicting global styles

---

**Remember**: This is for professional asset managers and hedge funds. Every design decision should prioritize clarity, performance, and data accuracy over aesthetics.
