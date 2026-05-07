import { Link } from 'react-router-dom';
import { Users, Tag, ArrowRight } from 'lucide-react';
import { truncate } from '../utils/helpers';

const GroupCard = ({ group }) => {
  const memberCount = group.members?.length || 0;
  const isAdmin = group.admin?._id === group.admin;

  return (
    <div className="card-hover p-5 flex flex-col gap-3 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base leading-tight">
            {group.name}
          </h3>
          <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <Users className="w-3 h-3" />
            {memberCount} member{memberCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent-light rounded-xl
                        flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">{group.name?.[0]?.toUpperCase()}</span>
        </div>
      </div>

      {/* Description */}
      {group.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {truncate(group.description, 100)}
        </p>
      )}

      {/* Tags */}
      {group.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {group.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="badge badge-purple">
              <Tag className="w-3 h-3 mr-1" />{tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <Link
        to={`/group/${group._id}`}
        className="flex items-center gap-2 text-secondary text-sm font-semibold
                   hover:gap-3 transition-all duration-200 mt-1"
      >
        View Group <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default GroupCard;
