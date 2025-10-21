import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, UserCircleIcon } from './icons/Icons';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AskChefProps {
  chatHistory: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  const renderText = (txt: string) => {
    const bolded = txt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: bolded };
  };

  const lines = text.split('\n').filter(line => line.trim() !== '');

  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        if (line.trim().startsWith('* ')) {
          return (
            <ul key={index} className="list-disc list-inside ml-2">
              <li dangerouslySetInnerHTML={renderText(line.replace('* ', ''))} />
            </ul>
          );
        }
        return <p key={index} dangerouslySetInnerHTML={renderText(line)} />;
      })}
    </div>
  );
};

export const AskChef: React.FC<AskChefProps> = ({ chatHistory, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-200px)]">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold font-display text-brand-green-dark dark:text-brand-green-light">
          Tanya Chef AI
        </h2>
        <p className="text-lg mt-2 text-gray-600 dark:text-gray-300">
          Punya pertanyaan seputar memasak? Tanyakan langsung pada ahlinya!
        </p>
      </div>

      <div className="flex-grow bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden">
        <div className="flex-grow p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {chatHistory.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <span className="text-6xl mb-4" role="img" aria-label="Chef emoji">👨‍🍳</span>
                <h3 className="text-xl font-bold">Halo! Saya Chef AI.</h3>
                <p>Ada yang bisa saya bantu seputar dunia masak-memasak hari ini?</p>
            </div>
          )}
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex items-start gap-4 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-10 h-10 rounded-full bg-brand-green-light dark:bg-brand-green-dark flex items-center justify-center shrink-0">
                  <span className="text-2xl" role="img" aria-label="Chef emoji">👨‍🍳</span>
                </div>
              )}
              <div className={`max-w-lg p-4 rounded-2xl prose dark:prose-invert prose-p:my-0 prose-ul:my-0 ${msg.role === 'user' ? 'bg-brand-green-dark text-white rounded-br-none' : 'bg-brand-beige-light dark:bg-gray-700 rounded-bl-none'}`}>
                 <MarkdownRenderer text={msg.text} />
              </div>
               {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center shrink-0">
                  <UserCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-300" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-brand-green-light dark:bg-brand-green-dark flex items-center justify-center shrink-0">
                  <span className="text-2xl" role="img" aria-label="Chef emoji">👨‍🍳</span>
              </div>
              <div className="max-w-lg p-4 rounded-2xl bg-brand-beige-light dark:bg-gray-700 rounded-bl-none">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
           <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaanmu di sini..."
              className="w-full bg-gray-100 dark:bg-gray-700/50 border-2 border-transparent focus:border-brand-green-dark focus:ring-0 rounded-lg p-3 transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-brand-green-dark text-white p-3 rounded-lg hover:bg-brand-green-dark/90 transition-transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 shrink-0"
              aria-label="Kirim pertanyaan"
            >
              <SendIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #A7D7C5; /* brand-green */
          border-radius: 20px;
          border: 3px solid #FFFFFF; /* white */
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #5C946E; /* brand-green-dark */
          border-color: #1f2937; /* gray-800 */
        }
      `}</style>
    </div>
  );
};