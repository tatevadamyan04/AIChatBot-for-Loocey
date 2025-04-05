import React from 'react';
import { ChatProvider } from '../src/contexts/ChatContext';
import ChatWidget from '../src/components/ChatWidget';

function App() {
  return (
    <ChatProvider>
      <div className="App">
        {/* Other application content */}
        <h1>My Application</h1>
        <p>Welcome to the app. The Loocey chat widget is in the corner.</p>

        {/* Render the Chat Widget */}
        <ChatWidget />

        {/* More application content */}
      </div>
    </ChatProvider>
  );
}

export default App;