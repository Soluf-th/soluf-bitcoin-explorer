
import React from 'react';
import { BlockchainInfo, BlockInfo } from '../types';
import { BitcoinRpcService } from '../services/bitcoinRpc';

interface DashboardProps {
  onBlockClick: (hash: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onBlockClick }) => {
  const [info, setInfo] = React.useState<BlockchainInfo | null>(null);
  const [networkHashRate, setNetworkHashRate] = React.useState<number | null>(null);
  const [latestBlocks, setLatestBlocks] = React.useState<BlockInfo[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [blockchainInfo, hashRate] = await Promise.all([
          BitcoinRpcService.getBlockchainInfo(),
          BitcoinRpcService.getNetworkHashPS()
        ]);
        setInfo(blockchainInfo);
        setNetworkHashRate(hashRate);

        // Fetch last 5 blocks
        const blocks: BlockInfo[] = [];
        let currentHash = blockchainInfo.bestblockhash;
        for (let i = 0; i < 6; i++) {
          const block = await BitcoinRpcService.getBlock(currentHash);
          blocks.push(block);
          currentHash = block.previousblockhash;
          if (!currentHash) break;
        }
        setLatestBlocks(blocks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400">Connecting to RPC nodes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Error Connecting to Bitcoin Node</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Best Block Height" 
          value={info?.blocks.toLocaleString() || '0'} 
          subValue="Chain Tip" 
          icon="📦"
        />
        <StatCard 
          label="Network Hashrate" 
          value={networkHashRate ? `${(networkHashRate / 1e18).toFixed(2)} EH/s` : '---'} 
          subValue="Estimated Computing Power" 
          icon="⚡"
        />
        <StatCard 
          label="Difficulty" 
          value={info ? `${(info.difficulty / 1e12).toFixed(2)}T` : '---'} 
          subValue="Mining Difficulty Adjustment" 
          icon="🧱"
        />
        <StatCard 
          label="Verification" 
          value={info ? `${(info.verificationprogress * 100).toFixed(4)}%` : '---'} 
          subValue="Progress to Synchronized" 
          icon="✅"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Blocks Table */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold">Latest Blocks</h3>
            <button className="text-xs text-orange-500 font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase text-slate-500 border-b border-slate-700/50">
                  <th className="px-6 py-4">Height</th>
                  <th className="px-6 py-4">Hash</th>
                  <th className="px-6 py-4">Transactions</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {latestBlocks.map((block) => (
                  <tr 
                    key={block.hash} 
                    className="hover:bg-slate-700/30 transition-colors cursor-pointer group"
                    onClick={() => onBlockClick(block.hash)}
                  >
                    <td className="px-6 py-4 text-orange-500 font-bold">{block.height}</td>
                    <td className="px-6 py-4 mono text-xs text-slate-400 group-hover:text-slate-200">
                      {block.hash.substring(0, 16)}...
                    </td>
                    <td className="px-6 py-4 text-sm">{block.nTx}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(block.time * 1000).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">{(block.size / 1024).toFixed(2)} KB</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Network Health Side Panel */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-bold mb-4">Network Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400">Network</span>
                <span className="uppercase text-green-500 font-bold">{info?.chain}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400">Disk Usage</span>
                <span className="">{info ? (info.size_on_disk / 1e9).toFixed(2) : '0'} GB</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400">Pruned</span>
                <span className={info?.pruned ? 'text-orange-500' : 'text-slate-200'}>
                  {info?.pruned ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                <span className="text-slate-400">Median Time</span>
                <span className="text-xs text-slate-200">
                  {info ? new Date(info.mediantime * 1000).toLocaleString() : '---'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-6 rounded-2xl shadow-xl text-white">
            <h3 className="text-lg font-bold mb-2">Did You Know?</h3>
            <p className="text-sm opacity-90 leading-relaxed">
              Every Bitcoin block contains a special "coinbase" transaction. This is how new bitcoins are created and awarded to the miner who discovered the block.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; subValueText?: string; subValue?: string; icon: string }> = ({ label, value, subValue, icon }) => (
  <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl shadow-lg hover:border-slate-600 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</span>
      <span className="text-xl">{icon}</span>
    </div>
    <div className="text-2xl font-bold mb-1 tracking-tight">{value}</div>
    {subValue && <div className="text-xs text-slate-500">{subValue}</div>}
  </div>
);
