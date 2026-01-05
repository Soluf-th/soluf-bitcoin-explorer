
import React from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { BlockDetails } from './components/BlockDetails';
import { TransactionDetails } from './components/TransactionDetails';
import { ViewMode } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = React.useState<ViewMode>(ViewMode.DASHBOARD);
  const [selectedId, setSelectedId] = React.useState<string>('');

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setCurrentView(ViewMode.DASHBOARD);
        return;
      }

      if (hash.startsWith('block-')) {
        setCurrentView(ViewMode.BLOCK);
        setSelectedId(hash.replace('block-', ''));
      } else if (hash.startsWith('tx-')) {
        setCurrentView(ViewMode.TRANSACTION);
        setSelectedId(hash.replace('tx-', ''));
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSearch = (query: string) => {
    // Simple logic to detect if it's likely a height, hash or txid
    if (query.length < 10 && !isNaN(parseInt(query))) {
      window.location.hash = `block-${query}`;
    } else if (query.startsWith('0000')) {
      window.location.hash = `block-${query}`;
    } else {
      // Assuming it's a TXID if not a block hash
      window.location.hash = `tx-${query}`;
    }
  };

  const navigateToDashboard = () => {
    window.location.hash = '';
  };

  const navigateToBlock = (hash: string) => {
    window.location.hash = `block-${hash}`;
  };

  const navigateToTx = (txid: string) => {
    window.location.hash = `tx-${txid}`;
  };

  return (
    <Layout 
      onSearch={handleSearch} 
      onNavigate={navigateToDashboard}
    >
      {currentView === ViewMode.DASHBOARD && (
        <Dashboard onBlockClick={navigateToBlock} />
      )}
      
      {currentView === ViewMode.BLOCK && (
        <BlockDetails 
          hashOrHeight={selectedId} 
          onTxClick={navigateToTx}
          onBack={navigateToDashboard}
        />
      )}

      {currentView === ViewMode.TRANSACTION && (
        <TransactionDetails 
          txid={selectedId} 
          onBlockClick={navigateToBlock}
          onBack={() => window.history.back()}
        />
      )}
    </Layout>
  );
};

export default App;
