import { ZERO_ADDRESS } from '../global.constant';
import type { NetworkConfig } from '../network.constant';
import { normalizeAddress } from '@/lib/helpers/global.helper';

export const ethNetworkConfig: NetworkConfig = {
  chainId: 1,
  chainTag: 'eth',
  gatewaySqdUrl: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
  finalityConfirmation: 12,
  contracts: {
    PoolManager: {
      address: normalizeAddress('0x000000000004444c5dc75cB358380D2e3dE08A90'),
      range: { from: 21688329 },
    },
    PositionDiscriptor: {
      address: normalizeAddress('0xd1428Ba554F4C8450b763a0B2040A4935c63f06C'),
      range: { from: 21689088 },
    },
    PositionManager: {
      address: normalizeAddress('0xbd216513d74c8cf14cf4747e6aaa6420ff64ee9e'),
      range: { from: 21689089 },
    },
    Permit2: {
      address: normalizeAddress('0x000000000022D473030F116dDEE9F6B43aC78BA3'),
      range: { from: 15986406 },
    },
  },
  blueChipTokens: [
    {
      address: ZERO_ADDRESS,
      decimals: 18,
      ticker: 'ETH',
    },
    {
      address: normalizeAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
      decimals: 18,
      ticker: 'WETH',
    },
    {
      address: normalizeAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'),
      decimals: 6,
      ticker: 'USDC',
    },
    {
      address: normalizeAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7'),
      decimals: 6,
      ticker: 'USDT',
    },
    {
      address: normalizeAddress('0x6B175474E89094C44Da98b954EedeAC495271d0F'),
      decimals: 18,
      ticker: 'DAI',
    },
  ],
};

export const getTokenByAddress = (address: string) => {
  const normalizedAddress = normalizeAddress(address);
  return ethNetworkConfig.blueChipTokens.find((token) => token.address === normalizedAddress);
};

export const getTokenByTicker = (ticker: string) => {
  const normalizedTicker = ticker.toUpperCase();
  return ethNetworkConfig.blueChipTokens.find((token) => token.ticker === normalizedTicker);
};

export const isBlueChipToken = (address: string) => {
  return getTokenByAddress(address) !== undefined;
};
