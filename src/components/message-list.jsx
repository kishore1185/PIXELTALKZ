import { useRef, useState } from "react";
import MessageItem from "./message-item.jsx";

// Helper function to format date to DD/MM/YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function MessageList({ messages, currentUserId, messagesEndRef, loading, onReplyMessage, onLoadMore, hasMore }) {
  const containerRef = useRef(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);
  const loadingMoreRef = useRef(false);

  if (loading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center">
        <p className="text-muted-foreground">No messages yet. Be the first to send one!</p>
      </div>
    );
  }

  let lastDisplayedDate = null;

  const handleScroll = (e) => {
    const el = e.currentTarget;
    setShowTopButton(el.scrollTop <= 40);
  };

  const handleLoadMoreClick = async () => {
    if (!onLoadMore || !hasMore || loadingMoreRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    const prevScrollHeight = el.scrollHeight;
    const prevTop = el.scrollTop;
    try {
      await onLoadMore();
    } finally {
      requestAnimationFrame(() => {
        const newScrollHeight = el.scrollHeight;
        el.scrollTop = newScrollHeight - prevScrollHeight + prevTop;
        setLoadingMore(false);
        loadingMoreRef.current = false;
      });
    }
  };

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 p-4 overflow-y-auto">
      <div className="sticky top-0 z-10 flex items-center justify-center pointer-events-none">
        {showTopButton && hasMore && !loadingMore && (
          <button
            onClick={handleLoadMoreClick}
            className="pointer-events-auto text-xs px-3 py-1 rounded-full bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 shadow"
          >
            Load older messages
          </button>
        )}
        {loadingMore && (
          <div className="pointer-events-none flex items-center justify-center py-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-500"></div>
          </div>
        )}
      </div>
      {messages.map((message) => {
        const messageDate = formatDate(message.timestamp);
        const shouldShowDate = messageDate !== lastDisplayedDate;
        lastDisplayedDate = messageDate;

        return (
          <div key={message.id}>
            {shouldShowDate && (
              <p className="text-center my-4">
                <span className="inline-block bg-zinc-500 text-white text-sm px-4 py-1 rounded-full shadow">
                  {messageDate}
                </span>
              </p>
            )}
            <MessageItem
              key={message.id}
              message={message}
              isCurrentUser={message.userId === currentUserId}
              onReply={onReplyMessage}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
