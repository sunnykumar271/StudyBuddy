import { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Send } from 'lucide-react';
import { selectMessages, addMessage } from '../features/groupSlice';
import { selectUser } from '../features/authSlice';
import { useSocket } from '../hooks/useSocket';
import Avatar from './Avatar';
import { formatChatTime } from '../utils/helpers';

const ChatWindow = ({ groupId }) => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const user = useSelector(selectUser);
  const socketRef = useSocket();
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current || !groupId || !user) return;

    socketRef.current.emit('join-room', { groupId, userId: user._id });

    socketRef.current.on('receive-message', (message) => {
      dispatch(addMessage(message));
    });

    return () => {
      socketRef.current?.off('receive-message');
      socketRef.current?.emit('leave-room', { groupId });
    };
  }, [groupId, user, socketRef, dispatch]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() || !socketRef.current) return;
    socketRef.current.emit('send-message', {
      groupId,
      userId: user._id,
      content: text.trim(),
    });
    setText('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-3">
              <Send className="w-7 h-7 text-secondary" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No messages yet. Be the first to say hi! 👋
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          const isOwn = msg.sender?._id === user?._id || msg.sender === user?._id;
          const senderName = msg.sender?.name || 'Unknown';

          return (
            <div
              key={msg._id || i}
              className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!isOwn && <Avatar name={senderName} size="xs" />}

              <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {!isOwn && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
                    {senderName} · {msg.sender?.department || ''}
                  </span>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${isOwn
                      ? 'bg-secondary text-white rounded-br-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-soft rounded-bl-sm'
                    }`}
                >
                  {msg.content}
                </div>
                <span className="text-xs text-gray-400 px-1">
                  {formatChatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3"
      >
        <input
          id="chat-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="input flex-1"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="btn-primary w-11 h-11 !p-0 flex items-center justify-center flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
