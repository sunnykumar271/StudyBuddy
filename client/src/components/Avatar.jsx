import { getInitials, getAvatarColor } from '../utils/helpers';

const sizeMap = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-sm',
  md: 'w-11 h-11 text-base',
  lg: 'w-14 h-14 text-xl',
  xl: 'w-20 h-20 text-3xl',
};

const Avatar = ({ name = '', size = 'md', className = '' }) => {
  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center
                  font-bold text-white flex-shrink-0 select-none ${className}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
