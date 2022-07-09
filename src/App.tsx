import { NoWorkYetProvider } from './contexts/no-work-yet';
import './index.css';
import { Homepage } from './pages/homepage';
import { TChatProvider } from './trpc/useTChat';

function App() {
  return (
    <TChatProvider>
      <NoWorkYetProvider>
        <Homepage />
      </NoWorkYetProvider>
    </TChatProvider>
  );
}

export default App;
