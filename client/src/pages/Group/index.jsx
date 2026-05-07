import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../features/authSlice';
import { groupService } from '../../services/groupService';
import {
  setCurrentGroup, clearCurrentGroup, selectCurrentGroup, selectMessages,
} from '../../features/groupSlice';
import { Users, ArrowLeft, LogIn } from 'lucide-react';
import Avatar from '../../components/Avatar';
import ChatWindow from '../../components/ChatWindow';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../utils/helpers';

const Group = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const group = useSelector(selectCurrentGroup);
  const messages = useSelector(selectMessages);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const { data } = await groupService.getById(id);
        dispatch(setCurrentGroup(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
    return () => dispatch(clearCurrentGroup());
  }, [id, dispatch]);

  const isMember = group?.members?.some(
    (m) => m._id === user?._id || m === user?._id
  );

  const handleJoin = async () => {
    try {
      await groupService.join(id);
      const { data } = await groupService.getById(id);
      dispatch(setCurrentGroup(data));
      toast.success('Joined the group!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner className="h-64" />;
  if (!group) return <div className="text-center py-16 text-gray-500">Group not found.</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* Group header */}
      <div className="card p-4 mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent-light rounded-xl
                          flex items-center justify-center">
            <span className="text-white font-bold">{group.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 dark:text-gray-100">{group.name}</h1>
            <p className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Users className="w-3 h-3" /> {group.members?.length} members
            </p>
          </div>
        </div>

        {/* Member avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {group.members?.slice(0, 4).map((m) => (
              <Avatar key={m._id || m} name={m.name || '?'} size="xs" className="ring-2 ring-white dark:ring-gray-900" />
            ))}
            {group.members?.length > 4 && (
              <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 ring-2 ring-white
                              dark:ring-gray-900 flex items-center justify-center text-xs font-semibold text-gray-600">
                +{group.members.length - 4}
              </div>
            )}
          </div>

          {!isMember && (
            <button onClick={handleJoin} className="btn-primary flex items-center gap-2 text-xs py-1.5 px-3 ml-2">
              <LogIn className="w-4 h-4" /> Join
            </button>
          )}
        </div>
      </div>

      {/* Tags */}
      {group.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {group.tags.map((tag) => (
            <span key={tag} className="badge badge-purple">{tag}</span>
          ))}
        </div>
      )}

      {/* Chat area */}
      <div className="card flex-1 overflow-hidden">
        {isMember ? (
          <ChatWindow groupId={id} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Join to chat</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              You need to be a member to participate in the group chat.
            </p>
            <button onClick={handleJoin} className="btn-primary">
              <LogIn className="w-4 h-4 inline mr-2" /> Join Group
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
export default Group;
