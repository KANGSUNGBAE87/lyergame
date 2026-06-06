import DiscussScreen from './screens/DiscussScreen.jsx';
import FinalScreen from './screens/FinalScreen.jsx';
import HistoryScreen from './screens/HistoryScreen.jsx';
import PeekScreen from './screens/PeekScreen.jsx';
import ResultScreen from './screens/ResultScreen.jsx';
import ReversalScreen from './screens/ReversalScreen.jsx';
import SetupScreen from './screens/SetupScreen.jsx';
import VoteScreen from './screens/VoteScreen.jsx';
import { I18nProvider } from './i18n/I18nProvider.jsx';
import { GameProvider, useGame } from './store/gameStore.jsx';

function Router() {
  const { state } = useGame();

  switch (state.phase) {
    case 'setup':
      return <SetupScreen />;
    case 'peek':
      return <PeekScreen />;
    case 'discuss':
      return <DiscussScreen />;
    case 'vote':
      return <VoteScreen />;
    case 'reversal':
      return <ReversalScreen />;
    case 'result':
      return <ResultScreen />;
    case 'final':
      return <FinalScreen />;
    case 'history':
      return <HistoryScreen />;
    default:
      return <SetupScreen />;
  }
}

export default function App() {
  return (
    <I18nProvider>
      <GameProvider>
        <Router />
      </GameProvider>
    </I18nProvider>
  );
}
