import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { groupService } from '../../services/groupService';
import { Layers, Plus } from 'lucide-react';
import SearchBar from '../../components/SearchBar';
import GroupCard from '../../components/GroupCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await groupService.getAll(params);
      setGroups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Browse Groups</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Join study groups, collaborate, and learn together.
          </p>
        </div>
        <Link to="/create-group" className="btn-primary flex items-center gap-2 flex-shrink-0">
          <Plus className="w-4 h-4" /> New Group
        </Link>
      </div>

      <SearchBar
        onSearch={fetchGroups}
        placeholder="Search groups by name or topic..."
        showFilters={false}
      />

      {loading ? (
        <LoadingSpinner className="h-48" />
      ) : groups.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No groups yet"
          description="Be the first to create a study group!"
          action={<Link to="/create-group" className="btn-primary">Create Group</Link>}
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

export default Groups;
