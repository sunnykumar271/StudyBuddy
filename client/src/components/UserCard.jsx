import { Link } from 'react-router-dom';
import { MapPin, Zap } from 'lucide-react';
import Avatar from './Avatar';
import ConnectionButton from './ConnectionButton';
import { truncate } from '../utils/helpers';

const UserCard = ({ user, matchScore, currentUserId }) => {
  return (
    <div className="card-hover p-5 flex flex-col gap-3 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <Link to={`/profile/${user._id}`} className="flex items-center gap-3 group">
          <Avatar name={user.name} size="md" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm
                           group-hover:text-secondary transition-colors">
              {user.name}
            </h3>
            <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <MapPin className="w-3 h-3" />
              {user.department || 'No department'}
            </p>
          </div>
        </Link>

        {matchScore !== undefined && (
          <div className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30
                          text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0">
            <Zap className="w-3 h-3" />
            {matchScore}%
          </div>
        )}
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {truncate(user.bio, 80)}
        </p>
      )}

      {/* Skills */}
      {user.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {user.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="tag">{skill}</span>
          ))}
          {user.skills.length > 4 && (
            <span className="tag text-gray-400">+{user.skills.length - 4}</span>
          )}
        </div>
      )}

      {/* Connect button */}
      {currentUserId && user._id !== currentUserId && (
        <ConnectionButton targetUserId={user._id} />
      )}
    </div>
  );
};

export default UserCard;
