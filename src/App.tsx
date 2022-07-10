import { NotImplementedFeaturesProvider } from './components';
import './index.css';
import { ChatPage } from './pages/ChatPage';
import { AppProvider } from './trpc/AppContext';

const DEFAULT_CHAT_SERVER_HOST = '127.0.0.1:8080';
const CHAT_PATH_STARTS_WITH = 'tchat.';

/**
 * Example:
 * import { httpLink } from '@trpc/client/links/httpLink';
 * httpLink({ url: `http://${your_host}/trpc` });
 */
const myTrpcLink = undefined;

function App() {
  return (
    <AppProvider
      host={DEFAULT_CHAT_SERVER_HOST}
      chatPathStartsWith={CHAT_PATH_STARTS_WITH}
      myTrpcLink={myTrpcLink}
    >
      <NotImplementedFeaturesProvider>
        <ChatPage />
      </NotImplementedFeaturesProvider>
    </AppProvider>
  );
}

export default App;
