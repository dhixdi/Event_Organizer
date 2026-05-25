import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { realtimeService } from '../services/realtimeService';
import { eventService } from '../services/eventService';
import Spinner from '../components/ui/Spinner';
import { formatRelative } from '../utils/formatters';

const POLL_INTERVAL = 5000; // 5 detik

const DIVISI_OPTIONS = [
  'Semua', 'Dekorasi', 'Catering', 'Sound System', 'Dokumentasi',
  'Keamanan', 'Transportasi', 'Perlengkapan', 'Acara', 'Humas', 'Panitia Inti',
];

function ChatBubble({ msg, isMe }) {
  return (
    <div className={`flex gap-2 mb-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        isMe ? 'bg-primary text-white' : 'bg-surface-2 text-text-muted'
      }`}>
        {(msg.pengirim_nama || 'U').charAt(0).toUpperCase()}
      </div>

      <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {!isMe && (
          <span className="text-xs text-text-light px-1">{msg.pengirim_nama}</span>
        )}
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
          isMe
            ? 'bg-primary text-white rounded-tr-sm'
            : 'bg-surface border border-border-light text-text-base rounded-tl-sm'
        }`}>
          {msg.tipe === 'gambar' && msg.file_url ? (
            <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="underline">
              📎 Lampiran
            </a>
          ) : (
            msg.pesan
          )}
        </div>
        <span className="text-[10px] text-text-light px-1">{formatRelative(msg.created_at)}</span>
      </div>
    </div>
  );
}

export default function Chat() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event,    setEvent]    = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [sending,  setSending]  = useState(false);
  const [text,     setText]     = useState('');
  const [divisi,   setDivisi]   = useState(user?.divisi || 'Semua');
  const [error,    setError]    = useState('');

  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const pollingRef  = useRef(null);
  const isFirstLoad = useRef(true);

  // Fetch event info
  useEffect(() => {
    eventService.getById(eventId)
      .then(r => setEvent(r.data.data.event))
      .catch(() => navigate('/events'));
  }, [eventId]);

  // Fetch messages
  const fetchMessages = useCallback(async (silent = false) => {
    try {
      const params = divisi && divisi !== 'Semua' ? { divisi } : {};
      const res = await realtimeService.getChatByEvent(eventId, params);
      const msgs = (res.data.data.messages || []).reverse(); // backend returns newest first
      setMessages(msgs);
      if (!silent) setLoading(false);
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch {
      if (!silent) setLoading(false);
    }
  }, [eventId, divisi]);

  // Initial load + polling
  useEffect(() => {
    isFirstLoad.current = true;
    setLoading(true);
    fetchMessages(false);

    pollingRef.current = setInterval(() => fetchMessages(true), POLL_INTERVAL);
    return () => clearInterval(pollingRef.current);
  }, [fetchMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isFirstLoad.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!user?.divisi && divisi === 'Semua') {
      setError('Pilih divisi terlebih dahulu untuk mengirim pesan.');
      return;
    }
    setSending(true);
    setError('');
    try {
      await realtimeService.sendMessage({
        event_id: parseInt(eventId),
        divisi: divisi !== 'Semua' ? divisi : user?.divisi,
        pesan: text.trim(),
        tipe: 'text',
      });
      setText('');
      await fetchMessages(true);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim pesan');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] -m-6 animate-fade-in">
      {/* Header */}
      <div className="bg-surface border-b border-border-light px-6 py-4 flex items-center gap-4 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-text-muted hover:text-text-base transition-colors"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-text-base truncate">
            💬 Chat Koordinasi
          </h1>
          {event && (
            <p className="text-xs text-text-muted truncate">{event.nama_event}</p>
          )}
        </div>

        {/* Divisi filter */}
        <select
          value={divisi}
          onChange={e => setDivisi(e.target.value)}
          className="input w-auto text-xs py-1.5"
        >
          {DIVISI_OPTIONS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 bg-background">
        {loading ? (
          <Spinner label="Memuat pesan..." />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface flex items-center justify-center text-3xl mb-4 shadow-card">
              💬
            </div>
            <p className="text-text-muted text-sm">Belum ada pesan di divisi ini.</p>
            <p className="text-text-light text-xs mt-1">Mulai percakapan koordinasi!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => {
              const isMe = msg.pengirim_id === user?.id;
              const prevMsg = messages[i - 1];
              const showDate = !prevMsg ||
                new Date(msg.created_at).toDateString() !== new Date(prevMsg.created_at).toDateString();
              return (
                <div key={msg.id || i}>
                  {showDate && (
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-border-light" />
                      <span className="text-[10px] text-text-light px-2 py-1 bg-surface rounded-full border border-border-light">
                        {new Date(msg.created_at).toLocaleDateString('id-ID', {
                          weekday: 'long', day: 'numeric', month: 'long'
                        })}
                      </span>
                      <div className="flex-1 h-px bg-border-light" />
                    </div>
                  )}
                  <ChatBubble msg={msg} isMe={isMe} />
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="px-6 py-2 bg-danger-bg border-t border-danger/20">
          <p className="text-sm text-danger">⚠️ {error}</p>
        </div>
      )}

      {/* Input */}
      <div className="bg-surface border-t border-border-light px-6 py-4 shrink-0">
        {!user?.divisi && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-warning-bg border border-warning/20 text-xs text-warning">
            ⚠️ Divisi kamu belum diset. Update profil atau pilih divisi di atas untuk mengirim pesan.
          </div>
        )}
        <form onSubmit={handleSend} className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan koordinasi... (Enter untuk kirim, Shift+Enter untuk baris baru)"
            rows={1}
            className="input flex-1 resize-none min-h-[44px] max-h-32 py-2.5"
            style={{ height: 'auto' }}
            onInput={e => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="btn-primary shrink-0 h-[44px] px-5 disabled:opacity-50"
          >
            {sending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              '→'
            )}
          </button>
        </form>
        <p className="text-[10px] text-text-light mt-2">
          Pesan diperbarui setiap 5 detik • Divisi: <strong>{divisi}</strong>
        </p>
      </div>
    </div>
  );
}