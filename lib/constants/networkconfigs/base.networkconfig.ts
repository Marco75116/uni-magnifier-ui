import type { NetworkConfig } from "../network.constant";
import { normalizeAddress } from "../../helpers/global.helper";
import { ZERO_ADDRESS } from "../global.constant";

export const baseNetworkConfig: NetworkConfig = {
  name: "Base",
  chainId: 8453,
  chainTag: "base",
  gatewaySqdUrl: "https://portal.sqd.dev/datasets/base-mainnet",
  finalityConfirmation: 1,
  scannerUrl: "https://basescan.org",
  contracts: {
    PoolManager: {
      address: normalizeAddress("0x498581ff718922c3f8e6a244956af099b2652b2b"),
      range: { from: 25_350_988 },
    },
    PositionDiscriptor: {
      address: normalizeAddress("0x25d093633990dc94bedeed76c8f3cdaa75f3e7d5"),
      range: { from: 25_350_992 },
    },
    PositionManager: {
      address: normalizeAddress("0x7c5f5a4bbd8fd63184577525326123b519429bdc"),
      range: { from: 25_350_993 },
    },
    Permit2: {
      address: normalizeAddress("0x000000000022D473030F116dDEE9F6B43aC78BA3"),
      range: { from: 25_350_988 },
    },
  },
  blueChipTokens: [
    {
      address: ZERO_ADDRESS,
      decimals: 18,
      ticker: "ETH",
    },
    {
      address: normalizeAddress("0x4200000000000000000000000000000000000006"),
      decimals: 18,
      ticker: "WETH",
    },
    {
      address: normalizeAddress("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
      decimals: 6,
      ticker: "USDC",
    },
    {
      address: normalizeAddress("0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"),
      decimals: 18,
      ticker: "DAI",
    },
  ],
};
