
import React from 'react';
import { BlockInfo } from '../types';
import { BitcoinRpcService } from '../services/bitcoinRpc';
import { GeminiService } from '../services/gemini';

interface BlockDetailsProps {
  hashOrHeight: string;
  onTxClick: (txid: string) => void;
  onBack: () => void;
}

export const BlockDetails: React.FC<BlockDetailsProps> = ({ hashOrHeight, onTxClick, onBack }) => {
  const [block, setBlock] = React.useState<BlockInfo | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = React.useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  React.useEffect(() => {
    const fetchBlock = async () => {
      try {
        setLoading(true);
        let hash = hashOrHeight;
        if (hashOrHeight.length < 10 && !isNaN(parseInt(hashOrHeight))) {
          hash = await BitcoinRpcService.getBlockHash(parseInt(hashOrHeight));
        }
        const data = await BitcoinRpcService.getBlock(hash);
        setBlock(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlock();
  }, [hashOrHeight]);

  const handleAiAnalysis = async () => {
    if (!block) return;
    setIsAnalyzing(true);
    const analysis = await GeminiService.analyzeBlockchainData('block', block);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Retrieving Block Data</p>
    </div>
  );

  if (error || !block) return (
    <div className="bg-red-500/5 border border-red-500/20 text-red-500 p-10 rounded-3xl text-center max-w-xl mx-auto">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-black mb-2 uppercase tracking-tight">Block Not Found</h2>
      <p className="mb-8 opacity-70 text-sm leading-relaxed">{error}</p>
      <button onClick={onBack} className="bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">Go Back</button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={onBack}
            className="p-3.5 hover:bg-slate-800 rounded-2xl border border-slate-700/50 transition-all active:scale-95 bg-slate-900/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-orange-500/10 text-orange-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Protocol Header</span>
              <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">v{block.version}</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter">Block #{block.height}</h2>
          </div>
        </div>
        
        {!aiAnalysis && !isAnalyzing && (
          <button 
            onClick={handleAiAnalysis}
            className="bg-gradient-to-br from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all flex items-center gap-3 active:scale-95"
          >
            <span className="text-lg">✨</span> Analyze Logic
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-[2rem] p-6 md:p-10 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-slate-100 uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]"></span>
              Core Specification
            </h3>
            <div className="space-y-1">
              <DetailRow 
                label="Hash" 
                value={block.hash} 
                isMono 
                isCopyable 
                tooltip="The unique cryptographic identifier for this block, created by double SHA-256 hashing the header."
              />
              <DetailRow 
                label="Confirmations" 
                value={block.confirmations.toString()} 
                tooltip="Number of blocks subsequently mined on top of this one. 6+ is considered mathematically irreversible."
              />
              <DetailRow 
                label="Difficulty" 
                value={block.difficulty.toLocaleString()} 
                tooltip="A measure of how hard it is to find a hash below a given target. Adjusts every 2016 blocks to maintain 10min timing."
              />
              <DetailRow 
                label="Size" 
                value={`${(block.size / 1024 / 1024).toFixed(4)} MB`} 
                tooltip="The total data size of this block in Megabytes. Includes all transaction data."
              />
              <DetailRow 
                label="Weight" 
                value={`${(parseInt(block.chainwork, 16) / 1e24).toFixed(4)}e24`} 
                tooltip="The total amount of work (hashing) required to produce the chain up to this block."
              />
              <DetailRow 
                label="Merkle Root" 
                value={block.merkleroot} 
                isMono 
                tooltip="The binary tree root hash of every transaction in this block. Proves a tx belongs to the block without full data."
              />
              <DetailRow 
                label="Timestamp" 
                value={new Date(block.time * 1000).toLocaleString()} 
                tooltip="The time the block was mined according to the miner's clock."
              />
            </div>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-[2rem] overflow-hidden backdrop-blur-sm">
            <div className="p-8 border-b border-slate-700/50 bg-slate-800/20 flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-widest">Transactions ({block.nTx})</h3>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Ledger</span>
            </div>
            <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-700/30 custom-scrollbar">
              {block.tx.map((txid, idx) => (
                <div 
                  key={txid}
                  onClick={() => onTxClick(txid)}
                  className="p-5 hover:bg-slate-700/30 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6 overflow-hidden">
                    <span className="text-slate-500 font-mono text-[10px] w-6 text-right opacity-50">{idx + 1}</span>
                    <span className="mono text-sm truncate text-slate-400 group-hover:text-orange-400 transition-colors">
                      {txid}
                    </span>
                  </div>
                  <div className="text-slate-700 group-hover:text-orange-500 transition-colors pl-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-700/80 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black flex items-center gap-3">
                  <span className="text-indigo-400">✨</span> AI ANALYSIS
                </h3>
              </div>
              
              {isAnalyzing && (
                <div className="flex flex-col items-center gap-6 py-10 text-indigo-300">
                  <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Decoding Protocol...</span>
                </div>
              )}

              {aiAnalysis ? (
                <div className="space-y-6">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-slate-300 leading-relaxed whitespace-pre-wrap font-medium text-[13px] border-l-2 border-indigo-500/30 pl-4 italic">
                      {aiAnalysis}
                    </p>
                  </div>
                  <button 
                    onClick={() => setAiAnalysis(null)}
                    className="w-full mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-slate-400 transition-colors py-2"
                  >
                    Clear Analysis
                  </button>
                </div>
              ) : !isAnalyzing ? (
                <div className="text-center py-6">
                  <p className="text-sm text-slate-500 leading-relaxed mb-8">
                    Generate an AI summary of this block's significance, mining metrics, and transaction density.
                  </p>
                  <button 
                    onClick={handleAiAnalysis}
                    className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                  >
                    Compute Insights
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          
          <div className="bg-slate-800/20 border border-slate-700/50 p-8 rounded-[2rem]">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Chain Status</h4>
            <div className="space-y-5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Nonce</span>
                <span className="text-slate-300 font-mono bg-slate-900/50 px-2 py-1 rounded-md">{block.nonce}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Bits</span>
                <span className="text-slate-300 font-mono">{block.bits}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Work</span>
                <span className="text-slate-300 font-mono text-[10px] truncate max-w-[120px]">{block.chainwork}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ 
  label: string; 
  value: string; 
  isMono?: boolean; 
  isCopyable?: boolean; 
  isLink?: boolean;
  onLinkClick?: () => void;
  tooltip?: string;
}> = ({ label, value, isMono, isCopyable, isLink, onLinkClick, tooltip }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-slate-700/20 last:border-0 gap-2 sm:gap-8 group/row">
    <div className="flex items-center gap-2 min-w-[160px]">
      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">{label}</span>
      {tooltip && (
        <div className="relative group/tooltip">
          <div className="cursor-help text-slate-700 hover:text-slate-400 transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="absolute bottom-full left-0 mb-3 hidden group-hover/tooltip:block w-64 p-4 bg-slate-900 border border-slate-700 text-[11px] leading-relaxed text-slate-300 rounded-2xl shadow-2xl z-[100] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="font-black text-orange-500 mb-2 uppercase text-[9px] tracking-[0.2em]">{label}</div>
            {tooltip}
            <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-slate-900 border-r border-b border-slate-700 rotate-45"></div>
          </div>
        </div>
      )}
    </div>
    <div className="flex-1 flex items-center gap-3 overflow-hidden">
      <span 
        className={`text-sm break-all leading-relaxed transition-all ${isMono ? 'mono text-slate-400' : 'font-bold text-slate-200'} ${isLink ? 'text-orange-500 hover:text-orange-400 cursor-pointer underline underline-offset-4 decoration-orange-500/20' : ''}`}
        onClick={isLink ? onLinkClick : undefined}
      >
        {value}
      </span>
      {isCopyable && (
        <button 
          onClick={() => {
            navigator.clipboard.writeText(value);
          }}
          className="text-slate-700 hover:text-orange-500 p-2 hover:bg-orange-500/5 rounded-xl transition-all shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
      )}
    </div>
  </div>
);
