import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface MonthlyFrequency {
  month: string;
  count: number;
}

interface WalletPositionsFrequencyProps {
  monthlyData: MonthlyFrequency[];
}

export function WalletPositionsFrequency({ monthlyData }: WalletPositionsFrequencyProps) {
  // Find the maximum count for scaling
  const maxCount = Math.max(...monthlyData.map((d) => d.count));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <CardTitle>Position Frequency</CardTitle>
          </div>
        </div>
        <CardDescription>Number of positions opened per month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {monthlyData.map((data) => {
            const percentage = (data.count / maxCount) * 100;
            return (
              <div key={data.month} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{data.month}</span>
                  <span className="text-muted-foreground">{data.count} positions</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
