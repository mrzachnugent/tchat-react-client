import './index.css';
import { Homepage } from './pages/homepage';
import { TChatProvider } from './TChatProvider';

function App() {
  return (
    <TChatProvider>
      <Homepage />
    </TChatProvider>
  );
}

export default App;
