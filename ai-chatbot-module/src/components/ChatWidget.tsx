import React from 'react';
import { useChat } from '../contexts/ChatContext';
import ChatWindow from './ChatWindow';

import '../styles/AIChatBot.css';

export default function ChatWidget() {
    const { isOpen, toggleChat } = useChat();

    function renderContent() {
        return (
            <div className="chat-widget-container">
                <ChatWindow />
                {!isOpen && (
                    <button
                        onClick={toggleChat}
                        className="chat-widget-button"
                        aria-label="Open Loocey Chat"
                        title="Open Loocey Chat"
                    >
                        Chat
                    </button>
                )}
            </div>
        );
    }
    return renderContent();
}