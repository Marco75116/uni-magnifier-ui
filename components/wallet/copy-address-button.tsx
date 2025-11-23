'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { networksConfigs } from '@/lib/constants/network.constant';

interface CopyAddressButtonProps {
  address: string;
}

interface Explorer {
  name: string;
  url: string;
}

export function CopyAddressButton({ address }: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  // Always show main explorers for wallet addresses (same address across all chains)
  const explorers: Explorer[] = [
    { name: 'Etherscan', url: `${networksConfigs.eth.scannerUrl}/address/${address}` },
    { name: 'Basescan', url: `${networksConfigs.base.scannerUrl}/address/${address}` },
    { name: 'Uniscan', url: `${networksConfigs.uni.scannerUrl}/address/${address}` },
  ];

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-6 w-6 p-0"
        title={copied ? 'Copied!' : 'Copy address'}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            title="View on block explorer"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {explorers.map((explorer) => (
            <DropdownMenuItem key={explorer.name} asChild>
              <a
                href={explorer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                {explorer.name}
              </a>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
