
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { SparklesIcon, SendIcon, AtlassianIcon } from './icons';

const TypingIndicator = () => (
    <div className="flex items-center space-x-1.5">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></div>
    </div>
);

interface MessageBubbleProps {
    message: ChatMessage;
    isStreaming?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isStreaming }) => {
    const isAssistant = message.role === 'assistant';

    return (
        <div className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}>
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${isAssistant ? 'bg-blue-100' : 'bg-slate-200'}`}>
                {isAssistant ? <SparklesIcon className="h-5 w-5 text-blue-600" /> : <span className="text-sm font-semibold text-slate-600">You</span>}
            </div>
            <div className={`relative max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${isAssistant ? 'bg-slate-100 text-slate-700' : 'bg-blue-600 text-white'}`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {isStreaming && <div className="absolute -bottom-2 -left-1"><TypingIndicator/></div>}
            </div>
        </div>
    );
};

interface NavigationAssistantProps {
    chatHistory: ChatMessage[];
    onSendMessage: (message: string) => void;
    isStreamingResponse: boolean;
}

const NavigationAssistant: React.FC<NavigationAssistantProps> = ({ chatHistory, onSendMessage, isStreamingResponse }) => {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isStreamingResponse) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatHistory.length === 0 && (
                    <div className="text-center py-10">
                        <AtlassianIcon className="mx-auto h-12 w-12 text-slate-300"/>
                        <h3 className="mt-2 text-lg font-medium text-slate-900">Navigation Assistant</h3>
                        <p className="mt-1 text-sm text-slate-500">Ask me anything about your workspace!</p>
                        <p className="mt-1 text-xs text-slate-400">e.g., "What is Project Phoenix?"</p>
                    </div>
                )}
                {chatHistory.map((msg, index) => (
                    <MessageBubble key={index} message={msg} isStreaming={isStreamingResponse && index === chatHistory.length - 1} />
                ))}
            </div>
            <div className="border-t border-slate-200 p-4 bg-white">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isStreamingResponse ? "Waiting for response..." : "Ask the assistant..."}
                        disabled={isStreamingResponse}
                        className="w-full pl-4 pr-12 py-2.5 border border-slate-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow duration-200"
                    />
                    <button
                        type="submit"
                        disabled={isStreamingResponse || !input.trim()}
                        className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-12 text-white bg-blue-600 rounded-full disabled:bg-slate-300 transition-colors duration-200 hover:bg-blue-700"
                    >
                        <SendIcon className="h-5 w-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NavigationAssistant;
