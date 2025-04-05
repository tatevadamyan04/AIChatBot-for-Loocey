import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';


// --- AI Service Call (Placeholder - Implementation in AIService.ts) ---

import { getAIResponse } from '../services/AIService';

// Define the structure of a chat message
export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

// Define the structure of the context state
export interface ChatState {
    isOpen: boolean;
    messages: Message[];
    isLoading: boolean;
    promptShortcuts: string[]; 
    initialState?: Omit<ChatState, 'initialState'>;
}

// Define the shape of the context value (state + actions)
interface ChatContextValue extends ChatState {
    toggleChat: () => void;
    addMessage: (message: Message) => void;
    setMessages: (messages: Message[]) => void;
    setLoading: (loading: boolean) => void;
    resetChat: () => void;
    sendMessage: (text: string, isShortcut?: boolean) => void; // Added convenience function
}

const defaultPromptShortcuts = [
    "How do I start a new project in Loocey?",
    "Explain the main dashboard.",
    "Where can I find export options?",
    "How to create search filters in Loocey and filter the RFQ list using multiple FSC codes",
];

const initialChatState: Omit<ChatState, 'initialState'> = {
    isOpen: false,
    messages: [
        // Initial welcome message from AI
        { id: 'init-ai', text: 'Hello! How can I help you with Loocey today?', sender: 'ai' }
    ],
    isLoading: false,
    promptShortcuts: defaultPromptShortcuts,
};
// --- End Default State ---


// Create the context with a default value (can be undefined initially)
export const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// Define props for the provider component
interface ChatProviderProps {
    children: ReactNode;
}

// --- Chat Provider Component ---
export function ChatProvider({ children }: ChatProviderProps) {
    const [state, setState] = useState<ChatState>({
        ...initialChatState,
        initialState: undefined, // Will be set by useEffect
    });


    useEffect(() => {
        console.log("ChatContext useEffect: Setting initial state copy for reset.");

        const initialCopy = { ...initialChatState };
        setState(currentState => ({
            ...currentState,
            initialState: initialCopy
        }));
    }, []);


    // Function to toggle chat window visibility
    const toggleChat = useCallback(function toggleChatCallback() {
        setState(prevState => ({ ...prevState, isOpen: !prevState.isOpen }));
    }, []);

    // Function to add a single message to the list
    const addMessage = useCallback(function addMessageCallback(message: Message) {
        setState(prevState => ({
            ...prevState,
            messages: [...prevState.messages, message]
        }));
    }, []);

    // Function to replace all messages (e.g., on reset)
    const setMessages = useCallback(function setMessagesCallback(messages: Message[]) {
         setState(prevState => ({ ...prevState, messages }));
    }, []);

    // Function to set loading state (e.g., while waiting for AI)
    const setLoading = useCallback(function setLoadingCallback(loading: boolean) {
        setState(prevState => ({ ...prevState, isLoading: loading }));
    }, []);

    // Function to reset the chat to its initial state
    const resetChat = useCallback(function resetChatCallback() {
        if (state.initialState) {
            console.log("Resetting chat state.");
            // Reset using the stored initial state, but keep the 'initialState' reference
            setState(prevState => ({
                ...prevState.initialState!, // Use the stored initial config
                initialState: prevState.initialState // Keep the reference itself
            }));
        } else {
            console.warn("Initial state for reset not found.");
        }
    }, [state.initialState]);

    // Convenience function to handle sending a message (user adds, then AI responds)
    const sendMessage = useCallback(async function sendMessageCallback(text: string, isShortcut: boolean = false) {
        if (!text.trim()) return; // Do not send empty messages

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: text,
            sender: 'user',
        };

        // Add user message immediately
        addMessage(userMessage);
        setLoading(true); // Set loading true

        try {
            const aiResponseText = await getAIResponse(text); // Using wrapper for AIService call

            const aiMessage: Message = {
                id: `ai-${Date.now()}`,
                text: aiResponseText,
                sender: 'ai',
            };
            addMessage(aiMessage); 

        } catch (error) {
            console.error("Error fetching AI response:", error);
            const errorMessage: Message = {
                id: `err-${Date.now()}`,
                text: "Sorry, I encountered an error. Please try again.",
                sender: 'ai',
            };
            addMessage(errorMessage); // Show error message to user
        } finally {
            setLoading(false); // Set loading false regardless of outcome
        }
    }, [addMessage, setLoading]); // Dependencies for useCallback

    // --- Value provided by the context ---
    const contextValue: ChatContextValue = {
        ...state,
        toggleChat,
        addMessage,
        setMessages,
        setLoading,
        resetChat,
        sendMessage
    };

    // Provide the state and actions to children components
    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
}


// --- Custom Hook for easy context consumption ---
export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}