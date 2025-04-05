import React, { useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';

/**
 * Displays the list of messages in the chat window.
 * Automatically scrolls to the bottom when new messages are added.
 */
export default function MessageList() {
    const { messages, isLoading } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to scroll to

    // Function to scroll to the bottom of the message list
    function scrollToBottom() {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    // Effect to scroll down when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]); // Dependency: messages array

    // Render method simulation for functional component
    function renderContent() {
        return (
            <div className="message-list">
                {messages.map((message) => (
                    <div key={message.id} className={`message-item message-${message.sender}`}>
                        <p>{message.text}</p>
                    </div>
                ))}
                {/* Display loading indicator */}
                {isLoading && (
                    <div className="message-item message-loading">
                        <p><i>Loocey AI is thinking...</i></p>
                    </div>
                )}
                {/* Empty div at the end to target for scrolling */}
                <div ref={messagesEndRef} />
            </div>
        );
    }

    return renderContent();
}