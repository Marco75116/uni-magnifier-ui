interface TickRangeBarProps {
  tickLower: number;
  tickUpper: number;
  currentTick: number;
}

export function TickRangeBar({ tickLower, tickUpper, currentTick }: TickRangeBarProps) {
  // Define the full range we want to display (e.g., min/max tick space)
  // Uniswap v4 typical tick range is approximately -887272 to 887272
  const MIN_TICK = -887272;
  const MAX_TICK = 887272;
  const FULL_RANGE = MAX_TICK - MIN_TICK;

  // Calculate positions as percentages
  const lowerPercent = ((tickLower - MIN_TICK) / FULL_RANGE) * 100;
  const upperPercent = ((tickUpper - MIN_TICK) / FULL_RANGE) * 100;
  const currentPercent = ((currentTick - MIN_TICK) / FULL_RANGE) * 100;
  const rangeWidth = upperPercent - lowerPercent;

  // Determine if current tick is in range
  const isInRange = currentTick >= tickLower && currentTick <= tickUpper;

  return (
    <div className="w-full space-y-1">
      {/* Tick range numbers */}
      <div className="flex justify-between text-xs font-mono text-muted-foreground">
        <span>{tickLower.toLocaleString()}</span>
        <span>{tickUpper.toLocaleString()}</span>
      </div>

      {/* Visual bar */}
      <div className="relative h-2 w-full rounded-full bg-muted">
        {/* Position range (colored section) */}
        <div
          className={`absolute h-full rounded-full ${
            isInRange ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{
            left: `${lowerPercent}%`,
            width: `${rangeWidth}%`,
          }}
        />

        {/* Current tick marker */}
        <div
          className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-orange-500"
          style={{
            left: `${currentPercent}%`,
          }}
          title={`Current tick: ${currentTick}`}
        />
      </div>
    </div>
  );
}
