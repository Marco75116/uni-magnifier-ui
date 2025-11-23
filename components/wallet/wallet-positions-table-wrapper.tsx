'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WalletPositionsTable } from './wallet-positions-table';

interface WalletPosition {
  id: string;
  chainId: number;
  poolId: string;
  poolName: string;
  amount0: string;
  symbol0: string;
  amount1: string;
  symbol1: string;
  fees0: string;
  fees1: string;
  tickLower: number;
  tickUpper: number;
  currentTick: number;
  age: string;
  pnl: number;
  pnlAdjusted: number;
  status: 'active' | 'inactive';
}

interface WalletPositionsTableWrapperProps {
  positions: WalletPosition[];
  totalPositions: number;
}

export function WalletPositionsTableWrapper({ positions, totalPositions }: WalletPositionsTableWrapperProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(totalPositions / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPositions = positions.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      <WalletPositionsTable positions={currentPositions} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalPositions)} of {totalPositions} positions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
