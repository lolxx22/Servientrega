import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Sparkles } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { TypingIndicator } from '../ui/Spinner';

const SUGGESTED = ['Crear guía', 'Rastrear envío', 'Consultar precio'];

export const ChatWidget = () => {
  const { isOpen, toggleChat, messages, isTyping, sendMessage, clearMessages } = useChatStore();
  const [input, setInput] = useState('');
  const endRef   = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 250); }, [isOpen]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    const msg = input.trim();
    setInput('');
    await sendMessage(msg);
  };

  return (
    <>
      {/* ── FAB button ── */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 50,
          width: 56, height: 56, borderRadius: '50%', border: 'none',
          background: isOpen ? '#1E293B' : 'linear-gradient(135deg, #1E8A4C, #0B1410)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.25)' : '0 4px 20px rgba(30,138,76,0.35)',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
      >
        {/* pulse ring when closed */}
        {!isOpen && (
          <span style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'rgba(30,138,76,0.3)', animation: 'pulse-glow 2s ease-in-out infinite',
          }} />
        )}
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X style={{ width: 20, height: 20, color: 'white' }} />
              </motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <MessageCircle style={{ width: 20, height: 20, color: 'white' }} />
              </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* ── Chat panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'fixed', bottom: 96, right: 28, zIndex: 50,
              width: 370, maxHeight: '68vh',
              display: 'flex', flexDirection: 'column',
              background: 'white', borderRadius: 20,
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
              overflow: 'hidden',
            }}
          >
            {/* header */}
            <div style={{ background: 'var(--color-primary)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot style={{ width: 19, height: 19, color: 'white' }} />
                </div>
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 11, height: 11, background: '#10B981', borderRadius: '50%', border: '2px solid var(--color-primary)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'white', lineHeight: 1.2 }}>Servibot AI</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <div style={{ width: 6, height: 6, background: '#10B981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.70)' }}>En línea · responde al instante</span>
                </div>
              </div>
              <button onClick={toggleChat} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Minimize2 style={{ width: 15, height: 15, color: 'white' }} />
              </button>
            </div>

            {/* messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', background: '#F8FAFB', display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* empty state */}
              {messages.length === 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '20px 8px' }}>
                  <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, rgba(30,138,76,0.12), rgba(30,138,76,0.06))', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Sparkles style={{ width: 26, height: 26, color: 'var(--color-primary)' }} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--color-neutral-900)', margin: '0 0 6px' }}>¡Hola! Soy Servibot AI</p>
                  <p style={{ fontSize: 12, color: 'var(--color-neutral-400)', lineHeight: 1.6, margin: '0 0 16px', padding: '0 12px' }}>
                    ¿Cómo puedo ayudarte hoy? Puedo ayudarte con envíos, seguimiento y más.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {SUGGESTED.map((s, i) => (
                      <motion.button
                        key={s}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.08 }}
                        onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 80); }}
                        style={{
                          width: '100%', padding: '9px 14px', fontSize: 12,
                          background: 'white', border: '1px solid var(--color-neutral-200)',
                          borderRadius: 10, color: 'var(--color-neutral-600)', cursor: 'pointer',
                          textAlign: 'left', transition: 'border-color 0.15s, color 0.15s',
                        }}
                      >{s}</motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* message list */}
              {messages.map(m => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 2 }}
                >
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', maxWidth: '85%' }}>
                    {m.role === 'assistant' && (
                      <div style={{ width: 26, height: 26, background: 'rgba(30,138,76,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 2 }}>
                        <Bot style={{ width: 13, height: 13, color: 'var(--color-primary)' }} />
                      </div>
                    )}
                    <div style={{
                      maxWidth: '100%', padding: '9px 14px', fontSize: 13, lineHeight: 1.55,
                      background: m.role === 'user' ? 'var(--color-primary)' : 'white',
                      color: m.role === 'user' ? 'white' : 'var(--color-neutral-800)',
                      borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      border: m.role === 'assistant' ? '1px solid var(--color-neutral-200)' : 'none',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{m.content}</p>
                    </div>
                    {m.role === 'user' && (
                      <div style={{ width: 26, height: 26, background: 'var(--color-neutral-200)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginBottom: 2 }}>
                        <User style={{ width: 13, height: 13, color: 'var(--color-neutral-500)' }} />
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--color-neutral-400)', margin: '0 34px', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                    {new Date(m.timestamp).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Guayaquil' })}
                  </span>
                </motion.div>
              ))}

              {/* typing */}
              {isTyping && (
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                  <div style={{ width: 26, height: 26, background: 'rgba(30,138,76,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot style={{ width: 13, height: 13, color: 'var(--color-primary)' }} />
                  </div>
                  <div style={{ background: 'white', border: '1px solid var(--color-neutral-200)', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* input */}
            <form onSubmit={submit} style={{ padding: '10px 12px', background: 'white', borderTop: '1px solid var(--color-neutral-100)', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  disabled={isTyping}
                  style={{
                    flex: 1, height: 40, padding: '0 14px',
                    background: 'var(--color-neutral-50)',
                    border: '1px solid var(--color-neutral-200)',
                    borderRadius: 10, fontSize: 13,
                    color: 'var(--color-neutral-900)', outline: 'none',
                    transition: 'border-color 0.15s',
                  }}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  style={{
                    width: 40, height: 40, flexShrink: 0,
                    background: 'var(--color-primary)', border: 'none',
                    borderRadius: 10, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: (!input.trim() || isTyping) ? 0.45 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  <Send style={{ width: 16, height: 16, color: 'white' }} />
                </motion.button>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 10, color: 'var(--color-neutral-400)', textAlign: 'center' }}>
                ServiBot AI · Powered by Anthropic Claude
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
