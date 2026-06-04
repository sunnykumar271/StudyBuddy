import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/authSlice';
import { userService } from '../../services/userService';
import { groupService } from '../../services/groupService';
import { connectionService } from '../../services/connectionService';
import { Zap, Users, MessageSquare, UserCheck, ChevronRight, TrendingUp } from 'lucide-react';
import UserCard from '../../components/UserCard';
import GroupCard from '../../components/GroupCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Avatar from '../../components/Avatar';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4 ">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center flex-shrink-0 `}>
      <Icon className="w-6 h-6 text-white  " />
    </div>
    <div className= "min-w-0">
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 ">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 break-words">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const user = useSelector(selectUser);
  const [matches, setMatches] = useState([]);
  const [groups, setGroups] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [matchRes, groupRes, connRes] = await Promise.all([
          userService.getMatches(),
          groupService.getAll(),
          connectionService.getMyConnections(),
        ]);
        setMatches(matchRes.data.slice(0, 6));
        setGroups(groupRes.data.slice(0, 4));
        setConnections(connRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner className="h-64" />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative flex items-center gap-4">
          <Avatar name={user?.name} size="lg" />
          <div>
            <p className="text-white/70 text-sm font-medium">Good to see you,</p>
            <h1 className="text-2xl font-bold">{user?.name} 👋</h1>
            <p className="text-white/70 text-sm mt-1">
              {user?.department || 'Set up your profile'} {user?.year ? `· ${user.year}` : ''}
            </p>
          </div>
        </div>
        {!user?.onboardingComplete && (
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 mt-4 bg-white/20 hover:bg-white/30
                       px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            Complete your profile <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={UserCheck} label="Connections" value={connections.length} color="bg-secondary" />
        <StatCard icon={MessageSquare} label="Groups Joined" value={groups.filter(g => g.members?.some(m => m._id === user?._id || m === user?._id)).length} color="bg-primary" />
        <StatCard icon={Zap} label="Matches Found" value={matches.length} color="bg-emerald-500" />
        <StatCard icon={TrendingUp} label="Skills" value={user?.skills?.length || 0} color="bg-amber-500" />
      </div>

      {/* Smart Matches */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-secondary" /> Smart Matches
          </h2>
          <Link to="/users" className="text-sm text-secondary font-semibold hover:underline flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {matches.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No matches yet.{' '}
              <Link to="/onboarding" className="text-secondary font-semibold hover:underline">
                Add your skills & interests
              </Link>{' '}
              to get matched!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map(({ user: u, matchScore }) => (
              <UserCard key={u._id} user={u} matchScore={matchScore} currentUserId={user?._id} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Groups */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" /> Recent Groups
          </h2>
          <Link to="/groups" className="text-sm text-secondary font-semibold hover:underline flex items-center gap-1">
            Browse all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {groups.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No groups yet.{' '}
              <Link to="/create-group" className="text-secondary font-semibold hover:underline">
                Create the first one!
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group) => (
              <GroupCard key={group._id} group={group} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
