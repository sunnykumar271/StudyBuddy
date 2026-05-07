import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/authSlice';
import { userService } from '../../services/userService';
import { Users } from 'lucide-react';
import SearchBar from '../../components/SearchBar';
import UserCard from '../../components/UserCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

const UsersPage = () => {
  const currentUser = useSelector(selectUser);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await userService.getAll(params);
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Find Students</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Discover students across departments. {total > 0 && `${total} students found.`}
        </p>
      </div>

      <SearchBar
        onSearch={fetchUsers}
        placeholder="Search by name, department, or skill..."
      />

      {loading ? (
        <LoadingSpinner className="h-48" />
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No students found"
          description="Try adjusting your search filters or explore different departments."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <UserCard key={u._id} user={u} currentUserId={currentUser?._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersPage;
