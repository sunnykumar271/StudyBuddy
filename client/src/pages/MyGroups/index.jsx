import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { groupService } from '../../services/groupService';
import { Plus, MessageSquare } from 'lucide-react';
import GroupCard from '../../components/GroupCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const MyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    groupService.getMine()
      .then(({ data }) => setGroups(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">My Groups</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Groups you&apos;ve created or joined.</p>
        </div>
        <Link to="/create-group" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Group
        </Link>
      </div>

      {loading ? (
        <LoadingSpinner className="h-48" />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="You haven't joined any groups yet"
          description="Browse groups or create your own study group!"
          action={
            <div className="flex gap-3">
              <Link to="/groups" className="btn-outline">Browse Groups</Link>
              <Link to="/create-group" className="btn-primary">Create Group</Link>
            </div>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {groups.map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGroups;
