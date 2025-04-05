import React, { useState, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';

/**
 * Component for the user to type messages, attach files, and send.
 */
export default function MessageInput() {
    const { sendMessage, isLoading } = useChat();
    const [inputValue, setInputValue] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    // Function to handle input change
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(event.target.value);
    }

    // Function to handle sending the message
    function handleSendMessage() {
        if (!inputValue.trim() || isLoading) return;

        // Use the sendMessage function from context
        sendMessage(inputValue);

        // Clear input after sending
        setInputValue('');
        setSelectedFileName(null); // Clear file name
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset file input
        }
    }

    // Function to handle Enter key press in input
    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        // Check if Enter key was pressed without Shift key
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent default newline behavior
            handleSendMessage();
        }
    }

    // Function to handle file selection
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            console.log('File selected:', file.name, file.size, file.type);
            setSelectedFileName(file.name);
            // TODO: Implement actual file handling/upload if required by AI API
            // This might involve reading the file content or sending the file object
            // Currently, it just logs the file info and shows the name.
        } else {
            setSelectedFileName(null);
        }
    }

    // Function to trigger file input click
    function triggerFileInput() {
        fileInputRef.current?.click();
    }


    // Render method simulation for functional component
    function renderContent() {
        return (
            <div className="message-input-area">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Loocey..."
                    disabled={isLoading}
                    aria-label="Chat message input"
                    className="message-input-field"
                />
                {/* Hidden file input */}
                 <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    aria-label="Attach file"
                 />
                 {/* Attach file button */}
                 <button
                    onClick={triggerFileInput}
                    disabled={isLoading}
                    className="message-input-button attach-button"
                    title="Attach File"
                >
                   📎 {/* Basic attachment icon */}
                 </button>
                 {/* Display selected file name */}
                 {selectedFileName && <span className="selected-file-name">{selectedFileName}</span>}
                <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="message-input-button send-button"
                    title="Send Message"
                >
                    Send
                </button>
            </div>
        );
    }

    return renderContent();
}