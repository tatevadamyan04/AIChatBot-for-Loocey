import React from 'react';
import { useChat } from '../contexts/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import PromptShortcuts from './PromptShortcuts';


export default function ChatWindow() {
    const { isOpen, toggleChat, resetChat } = useChat();

    if (!isOpen) {
        return null;
    }

    // Render method simulation for functional component
    function renderContent() {
        return (
            <div className="chat-window" role="log" aria-live="polite">
                {/* Header Section */}
                <header className="chat-window-header">
                    <h2>Loocey Help Chat</h2>
                    <div>
                        <button onClick={resetChat} className="chat-header-button" title="Reset Chat">Reset</button>
                        <button onClick={toggleChat} className="chat-header-button" title="Close Chat">Close</button>
                    </div>
                </header>

                {/* Message List Section */}
                <MessageList />

                {/* Prompt Shortcuts Section */}
                <PromptShortcuts />

                {/* Message Input Section */}
                <MessageInput />
            </div>
        );
    }

    return renderContent();
}