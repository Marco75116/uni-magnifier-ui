import { ethNetworkConfig } from './networkconfigs/eth.networkconfig';

export type ContractConfig = {
  address: string;
  range: { from: number };
};

export type ContractsConfig = {
  PoolManager: ContractConfig;
  PositionDiscriptor: ContractConfig;
  PositionManager: ContractConfig;
  Permit2: ContractConfig;
};

export type Token = {
  address: string;
  decimals: number;
  ticker: string;
};

export type NetworkConfig = {
  name: string;
  gatewaySqdUrl: string;
  finalityConfirmation: number;
  chainId: number;
  chainTag: string;
  contracts: ContractsConfig;
  blueChipTokens: Token[];
};

export const networksConfigs: Record<string, NetworkConfig> = {
  eth: ethNetworkConfig,
};

export const getNetworkConfig = (network: string): NetworkConfig => {
  const config = networksConfigs[network];
  if (!config) {
    throw new Error(`Network config not found for: ${network}`);
  }
  return config;
};
