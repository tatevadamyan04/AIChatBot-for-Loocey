import React from 'react';
import { useChat } from '../contexts/ChatContext';

/**
 * Displays clickable prompt shortcut buttons.
 */
export default function PromptShortcuts() {
    const { promptShortcuts, sendMessage, isLoading } = useChat();

    // Function to handle shortcut click
    function handleShortcutClick(prompt: string) {
        if (isLoading) return; // Prevent sending while loading
        // Use the sendMessage function from context, indicating it's a shortcut
        sendMessage(prompt, true);
    }

    // Render method simulation for functional component
    function renderContent() {
        // Don't render if no shortcuts are defined
        if (!promptShortcuts || promptShortcuts.length === 0) {
            return null;
        }

        return (
            <div className="prompt-shortcuts">
                <p className="shortcuts-title">Try asking:</p>
                {promptShortcuts.map((prompt, index) => (
                    <button
                        key={index}
                        onClick={() => handleShortcutClick(prompt)}
                        disabled={isLoading}
                        className="shortcut-button"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        );
    }
    return renderContent();
}