import txInIcon from "../assets/wallet/TxInIcon.svg";
import txOutIcon from "../assets/wallet/TxOutIcon.svg";
import txVoteIcon from "../assets/wallet/TxVoteIcon.svg";

export interface IRecipient {
  address: string;
  amount: string;
  chainSymbol?: string;
  tokenSymbol?: string;
  tokenAddr?: string;
  tokenDecimals?: Number;
  icon?: string;
}

export interface ISendCoinData {
  passphrase: string;
  fee: number;
  recipients: IRecipient[];
  vendorField?: string;
}

export interface ISendCoin {
  currentTokenSymbol: string;
  data: ISendCoinData;
}

// TODO: This is a display-only interface that normalizes transactions across all blockchains.
// Future architecture should implement proper multi-chain transaction handling:
//
// 1. Blockchain-specific interfaces that preserve native types
//    - Solar uses ITransactionData with BigNumber (see @solar-network/crypto)
//    - Ethereum uses ethers.TransactionResponse with BigInt
//    - Each chain has different decimal places (ETH=18, SXP=8, BTC=8)
//
// 2. Discriminated union pattern for type safety
//    - As used by ethers.js v6 for provider types
//    - Reference: https://github.com/ethers-io/ethers.js/blob/v6/src.ts/providers/provider.ts
//
// 3. String representation for JSON transport (prevents precision loss)
//    - Industry standard: OpenZeppelin, web3.js, ethers.js all use strings for amounts
//    - JavaScript Number.MAX_SAFE_INTEGER = 9,007,199,254,740,991
//    - Reference: https://docs.openzeppelin.com/contracts/4.x/erc20#a-note-on-decimals
//
// 4. Type guards and validation per blockchain
//    - Similar to how @solar-network/crypto validates transactions
//    - Each blockchain has different transaction structures (UTXO vs account-based)
//
// This would prevent precision loss and type confusion while maintaining type safety.
export interface ITransaction {
  txId: string;
  type: string;
  amount: string;
  asset: Array<{ amount: string; recipient: string }>;
  sender: string;
  fee: string;
  timestamp: number;
}

export interface ITransactionPagination {
  meta: {
    totalCount: number;
    pageCount: number;
    count: number;
  };
  data: Array<ITransaction>;
}

export const txIconMap: Map<string, string> = new Map([
  ["TX_IN", txInIcon],
  ["TX_OUT", txOutIcon],
  ["TX_VOTE", txVoteIcon],
]);
