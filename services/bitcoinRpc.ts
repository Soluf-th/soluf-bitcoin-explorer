
const RPC_URL = 'https://go.getblock.io/4c2f115ed7c943e485c261b545a6dc8b';

export class BitcoinRpcService {
  private static async call(method: string, params: any[] = []) {
    try {
      const response = await fetch(RPC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 'soluf-explorer',
          method,
          params,
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message || 'RPC Error');
      }
      return data.result;
    } catch (error) {
      console.error(`RPC Call Error [${method}]:`, error);
      throw error;
    }
  }

  static async getBlockchainInfo() {
    return this.call('getblockchaininfo');
  }

  static async getBlockCount() {
    return this.call('getblockcount');
  }

  static async getBlockHash(height: number) {
    return this.call('getblockhash', [height]);
  }

  static async getBlock(hash: string, verbosity: number = 1) {
    return this.call('getblock', [hash, verbosity]);
  }

  static async getRawTransaction(txid: string, verbose: boolean = true) {
    return this.call('getrawtransaction', [txid, verbose ? 1 : 0]);
  }

  static async getNetworkHashPS() {
    return this.call('getnetworkhashps');
  }
}
