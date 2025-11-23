'use client';

import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign, Settings, Maximize2 } from 'lucide-react';

// Sample data for Fee Revenue chart
const feeData = [
  { date: 'Jan 1', fees: 180 },
  { date: 'Jan 2', fees: 160 },
  { date: 'Jan 3', fees: 225 },
  { date: 'Jan 4', fees: 190 },
  { date: 'Jan 5', fees: 260 },
  { date: 'Jan 6', fees: 205 },
  { date: 'Jan 7', fees: 226 },
];

const feeConfig = {
  fees: {
    label: 'Fees',
    color: 'hsl(var(--chart-3))',
  },
};

// Order Book Component
const OrderBookChart = () => {
  const [currentPrice, setCurrentPrice] = useState(1847.52);
  const [tokenA] = useState('ETH');
  const [tokenB] = useState('USDC');
  const [precision, setPrecision] = useState('2');
  const [spread] = useState(0.02);
  const [lastTrade] = useState({ price: 1847.52, change: 0.15, changePercent: 0.0081 });
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Mock order book data
  const [mockOrderBook] = useState({
    asks: [
      { price: 1850.25, size: 12.5847, total: 12.5847, positions: 3 },
      { price: 1850.50, size: 8.2156, total: 20.8003, positions: 2 },
      { price: 1850.75, size: 15.9823, total: 36.7826, positions: 4 },
      { price: 1851.00, size: 22.3456, total: 59.1282, positions: 5 },
      { price: 1851.25, size: 18.7534, total: 77.8816, positions: 3 },
      { price: 1851.50, size: 31.2847, total: 109.1663, positions: 7 },
      { price: 1851.75, size: 9.8456, total: 119.0119, positions: 2 },
      { price: 1852.00, size: 45.6789, total: 164.6908, positions: 8 },
      { price: 1852.25, size: 28.9123, total: 193.6031, positions: 6 },
      { price: 1852.50, size: 17.4567, total: 211.0598, positions: 4 },
      { price: 1852.75, size: 33.7845, total: 244.8443, positions: 7 },
      { price: 1853.00, size: 41.2356, total: 286.0799, positions: 9 },
      { price: 1853.25, size: 19.8765, total: 305.9564, positions: 5 },
      { price: 1853.50, size: 52.1234, total: 358.0798, positions: 11 },
      { price: 1854.00, size: 38.9876, total: 397.0674, positions: 8 }
    ],
    bids: [
      { price: 1847.25, size: 24.5673, total: 24.5673, positions: 5 },
      { price: 1847.00, size: 18.9234, total: 43.4907, positions: 4 },
      { price: 1846.75, size: 35.7812, total: 79.2719, positions: 8 },
      { price: 1846.50, size: 12.3456, total: 91.6175, positions: 3 },
      { price: 1846.25, size: 29.8765, total: 121.494, positions: 6 },
      { price: 1846.00, size: 41.2389, total: 162.7329, positions: 9 },
      { price: 1845.75, size: 16.7834, total: 179.5163, positions: 4 },
      { price: 1845.50, size: 33.9876, total: 213.5039, positions: 7 },
      { price: 1845.25, size: 27.4567, total: 240.9606, positions: 6 },
      { price: 1845.00, size: 48.7123, total: 289.6729, positions: 10 },
      { price: 1844.75, size: 22.3456, total: 312.0185, positions: 5 },
      { price: 1844.50, size: 37.8934, total: 349.9119, positions: 8 },
      { price: 1844.25, size: 19.5678, total: 369.4797, positions: 4 },
      { price: 1844.00, size: 42.1234, total: 411.6031, positions: 9 },
      { price: 1843.75, size: 28.7865, total: 440.3896, positions: 6 }
    ]
  });

  const formatPrice = (price: number) => {
    return price.toFixed(parseInt(precision));
  };

  const formatSize = (size: number) => {
    return size.toFixed(4);
  };

  const formatTotal = (total: number) => {
    return total.toFixed(2);
  };

  const getDepthPercentage = (total: number, maxTotal: number) => {
    return (total / maxTotal) * 100;
  };

  const maxBidTotal = Math.max(...mockOrderBook.bids.map(b => b.total));
  const maxAskTotal = Math.max(...mockOrderBook.asks.map(a => a.total));
  const maxTotal = Math.max(maxBidTotal, maxAskTotal);

  const OrderBookRow = ({ order, type, maxTotal }: { order: any; type: string; maxTotal: number }) => {
    const depthPercentage = getDepthPercentage(order.total, maxTotal);
    const isAsk = type === 'ask';

    return (
      <div className="relative group cursor-pointer hover:bg-muted/50 transition-colors">
        {/* Depth Bar */}
        <div
          className={`absolute top-0 right-0 h-full transition-all duration-300 ${
            isAsk ? 'bg-red-500/15' : 'bg-green-500/15'
          }`}
          style={{ width: `${depthPercentage}%` }}
        />

        {/* Order Row */}
        <div className="relative z-10 grid grid-cols-4 gap-4 px-4 py-2 text-sm">
          <div className={`text-right font-mono ${isAsk ? 'text-red-500' : 'text-green-500'}`}>
            {formatPrice(order.price)}
          </div>
          <div className="text-right font-mono text-foreground">
            {formatSize(order.size)}
          </div>
          <div className="text-right font-mono text-muted-foreground">
            {formatTotal(order.total)}
          </div>
          <div className="text-right text-xs text-muted-foreground">
            {order.positions}
          </div>
        </div>
      </div>
    );
  };

  const PriceTickerRow = () => (
    <div className="bg-muted/50 border-y px-3 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {lastTrade.change >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-lg font-mono font-bold ${
            lastTrade.change >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {formatPrice(lastTrade.price)}
          </span>
        </div>
        <Badge variant={lastTrade.change >= 0 ? 'default' : 'destructive'} className="text-xs">
          {lastTrade.change >= 0 ? '+' : ''}{lastTrade.change.toFixed(2)} ({lastTrade.changePercent.toFixed(2)}%)
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground">
        ≈ ${(lastTrade.price * 1).toLocaleString()}
      </div>
    </div>
  );

  return (
    <Card className="w-full border-2">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{tokenA}/{tokenB}</CardTitle>
            <p className="text-sm text-muted-foreground">Order Book</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSettingsOpen(!settingsOpen)}>
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Settings Panel */}
      <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
        <CollapsibleContent>
          <div className="px-6 pb-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="precision">Price Precision</Label>
                <Select value={precision} onValueChange={setPrecision}>
                  <SelectTrigger id="precision">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">0.0</SelectItem>
                    <SelectItem value="2">0.00</SelectItem>
                    <SelectItem value="3">0.000</SelectItem>
                    <SelectItem value="4">0.0000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-price">Current Price</Label>
                <Input
                  id="current-price"
                  type="number"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(Number(e.target.value))}
                  step="0.01"
                />
              </div>
            </div>
            <Separator />
          </div>
        </CollapsibleContent>
      </Collapsible>

      <CardContent className="p-0">
        {/* Column Headers */}
        <div className="bg-muted/30 px-4 py-3 border-b">
          <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground font-medium">
            <div className="text-right">Price ({tokenB})</div>
            <div className="text-right">Size ({tokenA})</div>
            <div className="text-right">Total</div>
            <div className="text-right">Pos</div>
          </div>
        </div>

        {/* Order Book Container */}
        <div className="h-96">
          {/* Asks (Sell Orders) */}
          <ScrollArea className="h-40">
            <div className="flex flex-col-reverse pb-2">
              {mockOrderBook.asks.map((ask, index) => (
                <OrderBookRow
                  key={`ask-${index}`}
                  order={ask}
                  type="ask"
                  maxTotal={maxTotal}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Current Price */}
          <div className="my-1">
            <PriceTickerRow />
          </div>

          {/* Bids (Buy Orders) */}
          <ScrollArea className="h-40">
            <div className="pt-2">
              {mockOrderBook.bids.map((bid, index) => (
                <OrderBookRow
                  key={`bid-${index}`}
                  order={bid}
                  type="bid"
                  maxTotal={maxTotal}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Footer Stats */}
        <div className="bg-muted/30 border-t px-4 py-3">
          <div className="flex justify-between items-center text-xs">
            <div className="text-muted-foreground">
              Spread: <span className="text-foreground font-mono">{spread.toFixed(2)}%</span>
            </div>
            <div className="text-muted-foreground">
              Positions: <span className="text-foreground font-mono">{mockOrderBook.bids.length + mockOrderBook.asks.length}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-xs mt-2">
            <div className="text-muted-foreground">
              Volume: <span className="text-foreground font-mono">1,247.32 {tokenA}</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-green-500" />
              <Badge variant="outline" className="text-xs">
                Live
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Liquidity Distribution Component
const LiquidityDistributionChart = () => {
  // Current ETH/USDC price (example: $3,200)
  const currentPrice = 3200;
  const currentTick = -75000; // Example tick for current price

  // Toggle state for price vs tick display
  const [showTicks, setShowTicks] = useState(false);

  // Generate mock liquidity data centered around current price
  const generateLiquidityData = () => {
    const data = [];
    const priceRange = 1000; // $1000 range on each side
    const step = 25; // Price steps

    for (let i = -priceRange; i <= priceRange; i += step) {
      const price = currentPrice + i;

      // Convert price to tick (simplified calculation)
      const tick = Math.floor(Math.log(price / currentPrice) * 100000) + currentTick;

      // Create liquidity distribution with higher concentration near current price
      const distanceFromCurrent = Math.abs(i);
      const baseLiquidity = Math.max(0, 1000000 - (distanceFromCurrent * 800));

      // Add some realistic variation
      const variation = (Math.sin(i / 100) * 200000) + (Math.random() * 300000);
      const liquidity = Math.max(0, baseLiquidity + variation);

      // Calculate token amounts based on price and liquidity
      const totalValueUSD = liquidity;
      const ethAmount = totalValueUSD / (2 * price); // Roughly half the value in ETH
      const usdcAmount = totalValueUSD / 2; // Roughly half in USDC

      data.push({
        price: price,
        tick: tick,
        liquidity: liquidity,
        ethAmount: ethAmount,
        usdcAmount: usdcAmount,
        displayValue: showTicks ? tick : price
      });
    }

    return data.sort((a, b) => a.price - b.price);
  };

  const liquidityData = generateLiquidityData();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="text-foreground font-medium text-sm mb-2">
            {showTicks ? `Tick: ${Math.round(data.tick)}` : `Price: $${data.price?.toLocaleString()}`}
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-blue-600 dark:text-blue-400">
              USDC: ${data.usdcAmount?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-purple-600 dark:text-purple-400">
              ETH: {data.ethAmount?.toFixed(2)} ETH
            </p>
            <p className="text-green-600 dark:text-green-400">
              Liquidity: ${data.liquidity?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tick formatter for x-axis
  const formatXAxis = (value: number) => {
    if (showTicks) {
      return Math.round(value).toLocaleString();
    } else {
      if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}k`;
      }
      return `$${value}`;
    }
  };

  // Custom tick formatter for liquidity axis
  const formatLiquidity = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-muted-foreground" />
              Liquidity Distribution
            </CardTitle>
            <CardDescription className="mt-1">ETH/USDC pool liquidity by price range</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Current: <span className="text-green-600 dark:text-green-400 font-medium font-mono">${currentPrice.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="tick-toggle" className="text-sm text-foreground">
                {showTicks ? 'Ticks' : 'Price'}
              </Label>
              <Switch
                id="tick-toggle"
                checked={showTicks}
                onCheckedChange={setShowTicks}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={liquidityData}
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            >
              <defs>
                <linearGradient id="liquidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
                horizontal={true}
                vertical={false}
              />

              <XAxis
                dataKey={showTicks ? "tick" : "price"}
                type="number"
                scale="linear"
                domain={['dataMin', 'dataMax']}
                tickFormatter={formatXAxis}
                className="text-xs"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <YAxis
                tickFormatter={formatLiquidity}
                className="text-xs"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="stepAfter"
                dataKey="liquidity"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                fill="url(#liquidityGradient)"
                connectNulls={false}
              />

              {/* Current price indicator - vertical line */}
              <ReferenceLine
                x={showTicks ? currentTick : currentPrice}
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: "Current",
                  position: "top",
                  className: "fill-chart-2 text-xs font-medium"
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <Separator className="my-4" />
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-1))' }}></div>
              <span className="text-muted-foreground">Liquidity</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-1 rounded" style={{
                background: 'repeating-linear-gradient(to right, hsl(var(--chart-2)) 0, hsl(var(--chart-2)) 4px, transparent 4px, transparent 8px)'
              }}></div>
              <span className="text-muted-foreground">Current {showTicks ? 'Tick' : 'Price'}</span>
            </div>
          </div>
          <div className="text-muted-foreground">
            Peak: <span className="font-mono font-medium text-foreground">$1.2M</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function PoolAnalyticsCarousel() {
  return (
    <div className="w-full px-12">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {/* Chart 1: Liquidity Distribution */}
          <CarouselItem>
            <div className="p-1">
              <LiquidityDistributionChart />
            </div>
          </CarouselItem>

          {/* Chart 2: Order Book */}
          <CarouselItem>
            <div className="p-1">
              <OrderBookChart />
            </div>
          </CarouselItem>

          {/* Chart 3: Fee Revenue */}
          <CarouselItem>
            <div className="p-1">
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        Fee Revenue
                      </CardTitle>
                      <CardDescription className="mt-1">Daily fees collected (7 days)</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Activity className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <ChartContainer config={feeConfig} className="h-[300px] w-full">
                    <BarChart
                      accessibilityLayer
                      data={feeData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 10,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => value.slice(4)}
                        className="text-xs"
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `$${value}K`}
                        className="text-xs"
                      />
                      <ChartTooltip
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="fees"
                        fill="var(--color-fees)"
                        radius={[8, 8, 0, 0]}
                        className="transition-all hover:opacity-80"
                      />
                    </BarChart>
                  </ChartContainer>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-muted-foreground">
                        Total collected: <span className="font-medium text-foreground">$1.45M</span>
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      Avg: <span className="font-mono font-medium text-foreground">$207K/day</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
