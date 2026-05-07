// Generate initials-based avatar color from name
export const getAvatarColor = (name = '') => {
  const colors = [
    'bg-violet-500', 'bg-purple-500', 'bg-indigo-500', 'bg-blue-500',
    'bg-cyan-500', 'bg-teal-500', 'bg-emerald-500', 'bg-pink-500',
    'bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-lime-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

// Get initials from name (max 2 chars)
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Format relative time
export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

// Format full timestamp for chat
export const formatChatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Truncate text
export const truncate = (str, max = 80) => {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
};

// Extract API error message
export const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || 'Something went wrong';
};
