import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Lightbulb,
  Heart,
  Utensils,
  Activity,
  Moon,
  Brain,
  AlertCircle
} from 'lucide-react';

type MarkdownComponentProps = {
  node?: any;
  children?: React.ReactNode;
  [key: string]: any;
};
import { generateResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function AIAssistant() {
  const [storedMessages, setStoredMessages] = useLocalStorage<ChatMessage[]>('chat_messages', []);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Convert stored string timestamps to Date objects on component mount
  useEffect(() => {
    if (storedMessages && storedMessages.length > 0) {
      const parsedMessages = storedMessages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(parsedMessages);
    }
  }, [storedMessages]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    // First update with user message
    const userMessages = [...messages, userMessage];
    setStoredMessages(userMessages);
    setMessages(userMessages);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get response from Gemini AI
      const aiResponse = await generateResponse(message);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      // Then update with assistant's response
      const updatedMessages = [...userMessages, assistantMessage];
      setStoredMessages(updatedMessages);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I'm having trouble connecting to the AI service. Please try again later.",
        timestamp: new Date()
      };
      const updatedMessages = [...messages, errorMessage];
      setStoredMessages(updatedMessages);
      setMessages(updatedMessages);
    } finally {
      setIsTyping(false);
    }
  };

  // This function is no longer needed as we're using Gemini AI for responses

  const quickPrompts = [
    { text: "Help me with healthy eating tips", icon: Utensils },
    { text: "Show me exercise recommendations", icon: Activity },
    { text: "How can I sleep better?", icon: Moon },
    { text: "Stress management techniques", icon: Brain },
    { text: "Daily hydration tips", icon: Heart }
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col relative">
      {!import.meta.env.VITE_GEMINI_API_KEY && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-500" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Warning: No Gemini API key found. Please create a .env file in your project root and add VITE_GEMINI_API_KEY=your_api_key_here
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center space-x-3">
          <Bot className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold">AI Health Assistant</h1>
            <p className="text-indigo-100">Get personalized health and wellness guidance</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to your AI Health Assistant!</h3>
              <p className="text-gray-600 mb-6">I'm here to help you with health and wellness questions. Ask me anything!</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {quickPrompts.map((prompt, index) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => sendMessage(prompt.text)}
                      className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                    >
                      <Icon className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{prompt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[70%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-emerald-500 text-white ml-3' 
                    : 'bg-indigo-500 text-white mr-3'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}: MarkdownComponentProps) => (
                          <h1 className="text-xl font-bold my-2" {...props} />
                        ),
                        h2: ({node, ...props}: MarkdownComponentProps) => (
                          <h2 className="text-lg font-semibold my-2" {...props} />
                        ),
                        h3: ({node, ...props}: MarkdownComponentProps) => (
                          <h3 className="text-base font-medium my-1.5" {...props} />
                        ),
                        p: ({node, ...props}: MarkdownComponentProps) => (
                          <p className="mb-2" {...props} />
                        ),
                        ul: ({node, ...props}: MarkdownComponentProps) => (
                          <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />
                        ),
                        ol: ({node, ...props}: MarkdownComponentProps) => (
                          <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />
                        ),
                        li: ({node, ...props}: MarkdownComponentProps) => (
                          <li className="mb-1" {...props} />
                        ),
                        code: ({node, className, children, ...props}: MarkdownComponentProps) => {
                          const isInline = !className?.includes('language-');
                          if (isInline) {
                            return (
                              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                                {children}
                              </code>
                            );
                          }
                          return (
                            <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto my-2">
                              <code className="text-sm font-mono" {...props}>
                                {children}
                              </code>
                            </pre>
                          );
                        },
                        a: ({node, ...props}: MarkdownComponentProps) => (
                          <a 
                            className="text-blue-600 hover:underline" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            {...props} 
                          />
                        ),
                        blockquote: ({node, ...props}: MarkdownComponentProps) => (
                          <blockquote 
                            className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2" 
                            {...props} 
                          />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                  <div className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-emerald-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
              placeholder="Ask me about nutrition, exercise, sleep, or any health topic..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              disabled={isTyping}
            />
            <button
              onClick={() => sendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-3">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Lightbulb className="w-4 h-4" />
              <span>This AI provides general wellness information and is not a substitute for professional medical advice</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}