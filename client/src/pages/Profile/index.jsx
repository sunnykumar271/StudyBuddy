// src/pages/Profile/index.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/authSlice';
import { userService } from '../../services/userService';
import { MapPin, BookOpen, Star, Users, Edit2 } from 'lucide-react';
import Avatar from '../../components/Avatar';
import ConnectionButton from '../../components/ConnectionButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { timeAgo } from '../../utils/helpers';
import { connectionService } from '../../services/connectionService';
const Profile = () => {
  const { id } = useParams();
  const currentUser = useSelector(selectUser);
  const [profile, setProfile] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?._id === id;
  const [isSender, setIsSender] = useState(false); // New state to track if current user is sender
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data } = await userService.getById(id);
        setProfile(data.user);
        setConnectionStatus(data.connectionStatus);
        setConnectionId(data.connectionId);
        // ✅ Fetch real-time connection status to know isSender
        if(currentUser?._id && id) {
          try {
            const {data : connData} = await connectionService.getConnectionStatus(id);
            setConnectionStatus(connData.status);
            setConnectionId(connData.connectionId);
            setIsSender(connData.isSender); // backend already returns this
          
      } catch (err) {
        console.error(err);
      }
     }
     } catch (err) {
        console.error(err);
      }
     finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (!profile) return <div className="text-center py-16 text-gray-500">User not found.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Profile card */}
      <div className="card p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-5">
            <Avatar name={profile.name} size="xl" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{profile.name}</h1>
              <p className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-sm mt-1">
                <MapPin className="w-4 h-4" /> {profile.department || 'No department'}
              </p>
              {profile.year && (
                <span className="badge badge-blue mt-2">{profile.year}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {isOwnProfile ? (
              <Link to="/edit-profile" className="btn-outline flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Edit Profile
              </Link>
            ) : (
              <ConnectionButton
                targetUserId={id}
                initialStatus={connectionStatus}
                connectionId={connectionId}
                isSender={isSender}
              />
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Stats row */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-6">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{profile.connections?.length || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Connections</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{profile.skills?.length || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Skills</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{profile.interests?.length || 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Interests</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-0.5">{timeAgo(profile.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Skills */}
      {profile.skills?.length > 0 && (
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-secondary" /> Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => <span key={s} className="tag">{s}</span>)}
          </div>
        </div>
      )}

      {/* Interests */}
      {profile.interests?.length > 0 && (
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-secondary" /> Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((i) => <span key={i} className="badge badge-purple">{i}</span>)}
          </div>
        </div>
      )}

      {/* Subjects */}
      {profile.subjects?.length > 0 && (
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" /> Study Subjects
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.subjects.map((s) => <span key={s} className="badge badge-blue">{s}</span>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
