import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Sparkles } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { TypingIndicator } from '../ui/Spinner';

export const ChatWidget = () => {
  const { isOpen, toggleChat, messages, isTyping, sendMessage } = useChatStore();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      await sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const suggestedActions = [
    '¿Dónde está mi envío?',
    'Crear nuevo envío',
    'Horarios de atención',
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        id="chat-widget"
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 cursor-pointer group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          {/* Pulse ring */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-brand-green-600 animate-pulse-glow" />
          )}
          {/* Button */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            isOpen
              ? 'bg-neutral-800 shadow-neutral-900/20'
              : 'bg-gradient-to-br from-brand-green-600 to-brand-green-900 shadow-brand-green-600/30 group-hover:shadow-brand-green-600/40'
          }`}>
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 w-[380px] max-h-[70vh] max-h-[calc(70vh-env(safe-area-inset-bottom,0px))] z-50 flex flex-col overflow-hidden"
          >
            {/* Outer shell (double-bezel) */}
            <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl border border-neutral-200/80 overflow-hidden">
              {/* Header */}
              <div className="relative bg-brand-green-600 p-4 flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-brand-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm">Servibot AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                    <span className="text-white/70 text-[11px]">En línea</span>
                  </div>
                </div>
                <button
                  onClick={toggleChat}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Minimize2 className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/50">
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-green-600/10 to-brand-green-600/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-brand-green-600" />
                    </div>
                    <p className="font-bold text-neutral-900 mb-1 font-display">¡Hola! Soy Servibot AI</p>
                    <p className="text-xs text-neutral-400 px-4 leading-relaxed">
                      ¿Cómo puedo ayudarte hoy? Puedo ayudarte con envíos, seguimiento y más.
                    </p>
                    {/* Suggested actions */}
                    <div className="mt-4 space-y-2 px-2">
                      {suggestedActions.map((action, i) => (
                        <motion.button
                          key={action}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          onClick={() => {
                            setInputValue(action);
                            setTimeout(() => inputRef.current?.focus(), 100);
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-100 rounded-xl text-xs text-neutral-600 hover:border-brand-green-600/30 hover:text-brand-green-600 transition-all duration-200 cursor-pointer"
                        >
                          {action}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-7 h-7 bg-brand-green-600/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                        <Bot className="w-3.5 h-3.5 text-brand-green-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-brand-green-600 text-white rounded-2xl rounded-br-md shadow-sm shadow-brand-green-600/10'
                          : 'bg-white text-neutral-dark rounded-2xl rounded-bl-md border border-neutral-100 shadow-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-7 h-7 bg-neutral-200 rounded-lg flex items-center justify-center flex-shrink-0 ml-2 mt-1">
                        <User className="w-3.5 h-3.5 text-neutral-500" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 bg-brand-green-600/10 rounded-lg flex items-center justify-center flex-shrink-0 mr-2">
                      <Bot className="w-3.5 h-3.5 text-brand-green-600" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md border border-neutral-100 shadow-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-neutral-100">
                <div className="flex gap-2 items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 h-10 px-4 bg-neutral-100 border border-neutral-200 rounded-xl text-sm text-neutral-dark placeholder-neutral-400 focus:ring-2 focus:ring-brand-green-400/20 focus:border-brand-green-600 focus:bg-white outline-none transition-all duration-200"
                    disabled={isTyping}
                  />
                  <motion.button
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-brand-green-600 rounded-xl flex items-center justify-center shadow-md shadow-brand-green-600/20 hover:shadow-lg hover:shadow-brand-green-600/30 transition-all duration-200 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
