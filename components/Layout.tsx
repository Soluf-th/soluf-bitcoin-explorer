
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onSearch: (query: string) => void;
  onNavigate: (view: 'DASHBOARD') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onSearch, onNavigate }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleConnect = () => {
    // Simulated Web3Auth connection using the Sapphire Devnet configuration
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
          <div 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            onClick={() => onNavigate('DASHBOARD')}
          >
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-all">
              ₿
            </div>
            <span className="text-xl font-black tracking-tighter hidden sm:block">SOLUF <span className="text-orange-500">EXPLORER</span></span>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="Search block, txid, or height..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-2 px-12 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all text-sm placeholder:text-slate-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Network</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-green-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                SAPPHIRE DEVNET
              </div>
            </div>
            
            <button 
              onClick={handleConnect}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                isLoggedIn 
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' 
                : 'bg-orange-500 hover:bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-500/20'
              }`}
            >
              {isLoggedIn ? '0x7a2d...3f2e' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start text-sm text-slate-500">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center text-xs font-bold text-white">S</div>
                <span className="font-bold text-slate-300">Soluf Blockchain Identity</span>
              </div>
              <p className="text-xs leading-relaxed opacity-70">
                Powered by Web3Auth Sapphire Devnet.<br/>
                Client ID: BBc7Oph...EQNZzcD
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Resources</h4>
              <a href="#" className="hover:text-orange-500 transition-colors">RPC Documentation</a>
              <a href="https://api-auth.web3auth.io/.well-known/jwks.json" className="hover:text-orange-500 transition-colors">JWKS Endpoint</a>
              <a href="#" className="hover:text-orange-500 transition-colors">GetBlock.io API</a>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Protocol</h4>
              <p className="text-xs">Mainnet: Synchronized</p>
              <p className="text-xs">Explorer v1.4.2</p>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-slate-800 text-[10px] text-center text-slate-600 uppercase tracking-[0.3em]">
            © 2024 Soluf Bitcoin Explorer • All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};
